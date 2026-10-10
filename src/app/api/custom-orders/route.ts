// POST /api/custom-orders — ثبت سفارش پلاک اختصاصی
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getLivePrices, gramPriceByKarat, priceMap } from "@/lib/gold";

const PHONE_REGEX = /^(\+98|0|0098)?9\d{9}$/;

/** نرمال‌سازی شماره موبایل: تبدیل ارقام فارسی/عربی و حذف فاصله و علائم */
function normalizePhone(raw: string): string {
  return raw
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s\-()]/g, "");
}

const customOrderSchema = z.object({
  customerName: z
    .string({ error: "نام الزامی است" })
    .trim()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .max(80, "نام حداکثر ۸۰ کاراکتر است"),
  phone: z
    .string({ error: "شماره موبایل معتبر نیست" })
    .transform(normalizePhone)
    .refine((v) => PHONE_REGEX.test(v), "شماره موبایل معتبر نیست"),
  plaqueText: z
    .string({ error: "متن پلاک الزامی است" })
    .trim()
    .min(1, "متن پلاک الزامی است")
    .max(60, "متن پلاک حداکثر ۶۰ کاراکتر است"),
  shape: z.enum(["rectangle", "oval", "circle", "heart", "star"], {
    message: "فرم پلاک نامعتبر است",
  }),
  calligraphy: z.enum(["nastaliq", "thulth", "modern"], {
    message: "سبک خوشنویسی نامعتبر است",
  }),
  goldColor: z.enum(["yellow", "rose", "white"], {
    message: "رنگ طلا نامعتبر است",
  }),
  weight: z.coerce
    .number({ error: "وزن باید عدد معتبر باشد" })
    .min(1, "وزن باید بین ۱ تا ۳۰ گرم باشد")
    .max(30, "وزن باید بین ۱ تا ۳۰ گرم باشد"),
  karat: z.coerce
    .number({ error: "عیار باید عدد معتبر باشد" })
    .refine((v) => v === 18 || v === 21, "عیار باید ۱۸ یا ۲۱ باشد"),
  withChain: z.boolean({ error: "وضعیت زنجیر نامعتبر است" }),
  note: z.string().max(500, "یادداشت حداکثر ۵۰۰ کاراکتر است").optional(),
});

/** کد پیگیری شش‌رقمی */
function generateOrderCode(): string {
  return `PLK-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = customOrderSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "اطلاعات فرم نامعتبر است";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const data = parsed.data;

    // محاسبه قیمت سمت سرور بر اساس نرخ زنده بازار
    const prices = await getLivePrices();
    const map = priceMap(prices);
    const gram = gramPriceByKarat(map, data.karat);
    const base = gram * data.weight;
    const fee = base * 0.15; // اجرت ساخت پلاک اختصاصی: ۱۵٪
    const chainCost = data.withChain ? 2.5 * gramPriceByKarat(map, 18) : 0;
    const totalPrice = Math.round(base + fee + chainCost);

    const order = await db.customOrder.create({
      data: {
        orderCode: generateOrderCode(),
        customerName: data.customerName,
        phone: data.phone,
        plaqueText: data.plaqueText,
        shape: data.shape,
        calligraphy: data.calligraphy,
        goldColor: data.goldColor,
        weight: data.weight,
        karat: data.karat,
        withChain: data.withChain,
        note: data.note ?? null,
        totalPrice,
        status: "pending",
      },
    });

    return NextResponse.json(
      { orderCode: order.orderCode, totalPrice: order.totalPrice },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
