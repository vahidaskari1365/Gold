// GET /api/products — فهرست محصولات با قیمت لحظه‌ای
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeItemPrice, getLivePrices, priceMap } from "@/lib/gold";

const VALID_CATEGORIES = ["jewelry", "set", "coin", "bar", "melted"] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const featuredParam = searchParams.get("featured");

    const where: { category?: string; featured?: boolean } = {};

    // دسته‌بندی نامعتبر نادیده گرفته می‌شود و همه محصولات برمی‌گردد
    if (categoryParam && (VALID_CATEGORIES as readonly string[]).includes(categoryParam)) {
      where.category = categoryParam;
    }
    if (featuredParam === "1") {
      where.featured = true;
    }

    const [products, prices] = await Promise.all([
      db.product.findMany({ where, orderBy: { createdAt: "asc" } }),
      getLivePrices(),
    ]);
    const map = priceMap(prices);

    // قیمت نهایی هر محصول بر اساس نرخ زنده بازار
    const withPrice = products.map((p) => ({
      ...p,
      price: computeItemPrice(p, map),
    }));

    return NextResponse.json({ products: withPrice });
  } catch {
    return NextResponse.json(
      { error: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
