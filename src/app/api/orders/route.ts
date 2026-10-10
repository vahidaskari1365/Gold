// POST /api/orders — ثبت سفارش خرید از فروشگاه
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { computeItemPrice, getLivePrices, priceMap } from "@/lib/gold";

const PHONE_REGEX = /^(\+98|0|0098)?9\d{9}$/;

/** نرمال‌سازی شماره موبایل: تبدیل ارقام فارسی/عربی و حذف فاصله و علائم */
function normalizePhone(raw: string): string {
  return raw
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s\-()]/g, "");
}

const orderSchema = z.object({
  customerName: z
    .string({ error: "نام الزامی است" })
    .trim()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .max(80, "نام حداکثر ۸۰ کاراکتر است"),
  phone: z
    .string({ error: "شماره موبایل معتبر نیست" })
    .transform(normalizePhone)
    .refine((v) => PHONE_REGEX.test(v), "شماره موبایل معتبر نیست"),
  address: z
    .string({ error: "آدرس الزامی است" })
    .trim()
    .min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "آدرس حداکثر ۵۰۰ کاراکتر است"),
  note: z.string().max(500, "یادداشت حداکثر ۵۰۰ کاراکتر است").optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "شناسه محصول الزامی است"),
        quantity: z.coerce
          .number({ error: "تعداد باید عدد معتبر باشد" })
          .int("تعداد باید عدد صحیح باشد")
          .min(1, "تعداد باید بین ۱ تا ۱۰ باشد")
          .max(10, "تعداد باید بین ۱ تا ۱۰ باشد"),
      })
    )
    .min(1, "سبد سفارش خالی است"),
});

/** کد سفارش شش‌رقمی */
function generateOrderCode(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "اطلاعات سفارش نامعتبر است";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const data = parsed.data;

    // ادغام آیتم‌های تکراری برای جلوگیری از خطا در کاهش موجودی
    const qtyById = new Map<string, number>();
    for (const item of data.items) {
      qtyById.set(item.productId, (qtyById.get(item.productId) ?? 0) + item.quantity);
    }
    const ids = [...qtyById.keys()];

    // بررسی وجود همه محصولات
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    if (products.length !== ids.length) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    // بررسی موجودی
    for (const product of products) {
      const qty = qtyById.get(product.id) ?? 0;
      if (qty > product.stock) {
        return NextResponse.json({ error: "موجودی کافی نیست" }, { status: 400 });
      }
    }

    // قیمت واحد هر محصول بر اساس نرخ زنده بازار
    const prices = await getLivePrices();
    const map = priceMap(prices);
    const itemLines = products.map((p) => {
      const qty = qtyById.get(p.id) ?? 0;
      return {
        name: p.name,
        slug: p.slug,
        price: computeItemPrice(p, map),
        qty,
      };
    });
    const total = Math.round(
      itemLines.reduce((sum, line) => sum + line.price * line.qty, 0)
    );

    const orderCode = generateOrderCode();

    // ایجاد سفارش و کاهش موجودی در یک تراکنش اتمیک
    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderCode,
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          note: data.note ?? null,
          items: JSON.stringify(itemLines),
          total,
          status: "pending",
        },
      });

      for (const product of products) {
        const qty = qtyById.get(product.id) ?? 0;
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: qty } },
        });
      }

      return created;
    });

    return NextResponse.json(
      { orderCode: order.orderCode, total: order.total },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
