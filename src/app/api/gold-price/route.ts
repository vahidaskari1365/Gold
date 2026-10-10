// GET /api/gold-price — قیمت‌های لحظه‌ای بازار
import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/gold";

export async function GET() {
  try {
    const prices = await getLivePrices();
    return NextResponse.json({
      prices,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
