// POST /api/trade-requests — درخواست خرید/فروش طلا، شمش و سکه
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getLivePrices, priceMap } from "@/lib/gold";

const PHONE_REGEX = /^(\+98|0|0098)?9\d{9}$/;

/** نرمال‌سازی شماره موبایل: تبدیل ارقام فارسی/عربی و حذف فاصله و علائم */
function normalizePhone(raw: string): string {
  return raw
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s\-()]/g, "");
}

const ASSET_SYMBOL: Record<string, string> = {
  gold18: "gold_18",
  gold24: "gold_24",
  melted: "melted",
  bar: "bar",
  coin_emami: "coin_emami",
};

const tradeRequestSchema = z.object({
  side: z.enum(["buy", "sell"], { message: "نوع درخواست نامعتبر است" }),
  asset: z.enum(["gold18", "gold24", "melted", "bar", "coin_emami"], {
    message: "نوع دارایی نامعتبر است",
  }),
  weight: z.coerce
    .number({ error: "وزن باید عدد معتبر باشد" })
    .positive("وزن باید بزرگ‌تر از صفر باشد"),
  customerName: z
    .string({ error: "نام الزامی است" })
    .trim()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .max(80, "نام حداکثر ۸۰ کاراکتر است"),
  phone: z
    .string({ error: "شماره موبایل معتبر نیست" })
    .transform(normalizePhone)
    .refine((v) => PHONE_REGEX.test(v), "شماره موبایل معتبر نیست"),
});

/** کد پیگیری شش‌رقمی */
function generateCode(): string {
  return `TR-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = tradeRequestSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "اطلاعات درخواست نامعتبر است";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const data = parsed.data;

    // سکه امامی: تعداد قطعه (۱ تا ۵۰) — بقیه: وزن گرم (۰٫۱ تا ۱۰۰۰)
    if (data.asset === "coin_emami") {
      if (!Number.isInteger(data.weight) || data.weight < 1 || data.weight > 50) {
        return NextResponse.json(
          { error: "تعداد سکه باید بین ۱ تا ۵۰ عدد باشد" },
          { status: 400 }
        );
      }
    } else if (data.weight < 0.1 || data.weight > 1000) {
      return NextResponse.json(
        { error: "وزن باید بین ۰٫۱ تا ۱۰۰۰ گرم باشد" },
        { status: 400 }
      );
    }

    const prices = await getLivePrices();
    const map = priceMap(prices);
    const symbol = ASSET_SYMBOL[data.asset];
    const unit = map[symbol]?.price ?? 0;
    if (unit <= 0) {
      // نرخ بازار در دسترس نیست — به‌عنوان خطای سرور گزارش می‌شود
      throw new Error("price_unavailable");
    }

    let amount = unit * data.weight;
    if (data.side === "buy") {
      amount = Math.round(amount * 1.005); // حباب خرید: ۰٫۵٪
    } else {
      amount = Math.round(amount * 0.985); // کارمزد فروش: ۱٫۵٪
    }

    const trade = await db.tradeRequest.create({
      data: {
        code: generateCode(),
        side: data.side,
        asset: data.asset,
        weight: data.weight,
        amount,
        customerName: data.customerName,
        phone: data.phone,
        status: "pending",
      },
    });

    return NextResponse.json(
      { code: trade.code, amount: trade.amount, side: trade.side, asset: trade.asset },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
