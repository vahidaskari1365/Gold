// محاسبات قیمت طلا — مستقل از سرور (قابل استفاده در کلاینت و سرور)

export type LivePrice = {
  symbol: string
  name: string
  unit: string
  price: number
  openPrice: number
  changePercent: number
  updatedAt: string
}

export function priceMap(prices: LivePrice[]): Record<string, LivePrice> {
  return Object.fromEntries(prices.map((p) => [p.symbol, p]))
}

/** قیمت هر گرم بر اساس عیار */
export function gramPriceByKarat(map: Record<string, LivePrice>, karat: number): number {
  if (karat === 24) return map["gold_24"]?.price ?? 0
  if (karat === 18) return map["gold_18"]?.price ?? 0
  // بقیه عیارها به‌صورت خطی از ۲۴ عیار
  return (map["gold_24"]?.price ?? 0) * (karat / 24)
}

export type PriceBreakdown = {
  base: number // ارزش طلای خالص
  fee: number // اجرت ساخت
  profit: number // سود فروشنده
  tax: number // مالیات
  total: number
}

/** محاسبه قیمت یک محصول طلا */
export function calcProductPrice(opts: {
  gramPrice: number
  weight: number
  makingFee: number // درصد
  profit: number // درصد
  tax: number // درصد
}): PriceBreakdown {
  const base = opts.gramPrice * opts.weight
  const fee = (base * opts.makingFee) / 100
  const profit = (base * opts.profit) / 100
  const tax = ((fee + profit) * opts.tax) / 100
  return { base, fee, profit, tax, total: Math.round(base + fee + profit + tax) }
}

/** نماد قیمت سکه‌ای برای هر محصول سکه (سکه قیمت مستقل از وزن دارد) */
export const COIN_SYMBOL_BY_SLUG: Record<string, string> = {
  "coin-emami": "coin_emami",
  "coin-bahar-new": "coin_bahar",
  "coin-half": "coin_half",
  "coin-quarter": "coin_quarter",
}

export type ProductLike = {
  slug: string
  category: string
  weight: number
  karat: number
  makingFee: number
  profit: number
}

/**
 * قیمت نهایی یک محصول را بر اساس قیمت‌های زنده بازار حساب می‌کند.
 * سکه → قیمت مستقل سکه | شمش → نرخ گرم شمش | آب‌شده → نرخ گرم آب‌شده
 * جواهر/سرویس → ارزش طلا + اجرت + سود + مالیات
 */
export function computeItemPrice(
  product: ProductLike,
  map: Record<string, LivePrice>
): number {
  const profitMul = 1 + product.profit / 100
  if (product.category === "coin") {
    const sym = COIN_SYMBOL_BY_SLUG[product.slug]
    const unit = map[sym]?.price ?? 0
    return Math.round(unit * profitMul)
  }
  if (product.category === "bar") {
    return Math.round(product.weight * (map["bar"]?.price ?? 0) * profitMul)
  }
  if (product.category === "melted") {
    return Math.round(product.weight * (map["melted"]?.price ?? 0) * profitMul)
  }
  const gram = gramPriceByKarat(map, product.karat)
  const b = calcProductPrice({
    gramPrice: gram,
    weight: product.weight,
    makingFee: product.makingFee,
    profit: product.profit,
    tax: 9,
  })
  return b.total
}

/** حباب/کارمزد خرید و فروش */
export const BUY_MULT = 1.005 // حباب خرید از گالری
export const SELL_MULT = 0.985 // کارمزد خرید از مشتری (۱٫۵٪)
