// قیمت لحظه‌ای واقعی بازار ایران — منبع رسمی: tgju.org
// فقط سمت سرور اجرا می‌شود؛ کش حافظه + کش پشتیبان دیتابیس
import { db } from "@/lib/db"
import type { LivePrice } from "@/lib/gold-calc"

export * from "@/lib/gold-calc"

const TGJU_URL = "https://call1.tgju.org/ajax.json"
const CACHE_TTL_MS = 30_000
const FETCH_TIMEOUT_MS = 8_000

type TgjuItem = { p?: string; d?: string; dp?: number | string }

type Instrument = {
  symbol: string
  tgju: string // نماد در tgju (خالی = مشتقه محاسباتی)
  name: string
  unit: string
  rialToToman: boolean
  fallback: number // تومان — فقط در قطع‌شدن کامل اینترنت
  base?: string // برای مشتقه‌ها
  premium?: number
}

const INSTRUMENTS: Instrument[] = [
  { symbol: "gold_18", tgju: "geram18", name: "طلای ۱۸ عیار", unit: "gram", rialToToman: true, fallback: 26_600_000 },
  { symbol: "gold_24", tgju: "geram24", name: "طلای ۲۴ عیار", unit: "gram", rialToToman: true, fallback: 35_450_000 },
  { symbol: "mesghal", tgju: "mesghal", name: "مثقال طلا", unit: "mesghal", rialToToman: true, fallback: 115_200_000 },
  { symbol: "coin_emami", tgju: "sekee", name: "سکه امامی", unit: "piece", rialToToman: true, fallback: 271_800_000 },
  { symbol: "coin_bahar", tgju: "sekeb", name: "سکه بهار آزادی", unit: "piece", rialToToman: true, fallback: 261_300_000 },
  { symbol: "coin_half", tgju: "nim", name: "نیم‌سکه", unit: "piece", rialToToman: true, fallback: 143_300_000 },
  { symbol: "coin_quarter", tgju: "rob", name: "ربع‌سکه", unit: "piece", rialToToman: true, fallback: 77_000_000 },
  { symbol: "coin_gram", tgju: "retail_gerami", name: "سکه گرمی", unit: "piece", rialToToman: true, fallback: 38_200_000 },
  { symbol: "ounce", tgju: "ons", name: "اونس جهانی طلا", unit: "ounce", rialToToman: false, fallback: 4194 },
  { symbol: "bar", tgju: "", name: "شمش طلا ۲۴ عیار", unit: "gram", rialToToman: true, fallback: 35_880_000, base: "gold_24", premium: 1.012 },
  { symbol: "melted", tgju: "", name: "طلای آب‌شده", unit: "gram", rialToToman: true, fallback: 25_900_000, base: "gold_18", premium: 0.975 },
]

const DISPLAY_ORDER = [
  "gold_18",
  "gold_24",
  "mesghal",
  "coin_emami",
  "coin_bahar",
  "coin_half",
  "coin_quarter",
  "coin_gram",
  "bar",
  "melted",
  "ounce",
]

type MemCache = { at: number; prices: LivePrice[] }
let memCache: MemCache | null = null

function parseNum(v: string | number | undefined): number {
  if (v === undefined || v === null) return NaN
  const n = Number(String(v).replace(/,/g, "").trim())
  return Number.isFinite(n) ? n : NaN
}

async function fetchTgju(): Promise<Record<string, TgjuItem> | null> {
  try {
    const res = await fetch(TGJU_URL, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { current?: Record<string, TgjuItem> }
    return json?.current ?? null
  } catch {
    return null
  }
}

/** ساخت قیمت‌ها از داده‌ی زنده tgju (قیمت‌های ریالی به تومان تبدیل می‌شوند) */
function buildFromTgju(current: Record<string, TgjuItem>): LivePrice[] | null {
  const raw = new Map<string, { price: number; change: number; dp: number }>()

  for (const ins of INSTRUMENTS) {
    if (!ins.tgju) continue
    const item = current[ins.tgju]
    if (!item) continue
    let price = parseNum(item.p)
    if (!Number.isFinite(price) || price <= 0) continue
    const div = ins.rialToToman ? 10 : 1
    price = price / div
    const change = parseNum(item.d) / div || 0
    const dpRaw = parseNum(item.dp)
    const dp = Number.isFinite(dpRaw) ? dpRaw : 0
    raw.set(ins.symbol, { price, change, dp })
  }

  if (!raw.has("gold_18")) return null // داده اصلی نیامده — قابل اعتماد نیست

  const now = new Date().toISOString()
  const out: LivePrice[] = INSTRUMENTS.map((ins) => {
    if (ins.tgju) {
      const r = raw.get(ins.symbol)
      if (r) {
        return {
          symbol: ins.symbol,
          name: ins.name,
          unit: ins.unit,
          price: Math.round(r.price),
          openPrice: Math.round(r.price - r.change),
          changePercent: r.dp,
          updatedAt: now,
        }
      }
    }
    // مشتقه (شمش / آب‌شده) بر اساس نماد پایه
    const base = ins.base ? raw.get(ins.base) : undefined
    if (base && ins.premium) {
      const price = base.price * ins.premium
      const change = base.change * ins.premium
      return {
        symbol: ins.symbol,
        name: ins.name,
        unit: ins.unit,
        price: Math.round(price),
        openPrice: Math.round(price - change),
        changePercent: base.dp,
        updatedAt: now,
      }
    }
    return null
  }).filter((p): p is LivePrice => p !== null)

  return out.length >= 8 ? out : null
}

/** در نبود اینترنت: آخرین قیمت‌های ذخیره‌شده در دیتابیس */
async function buildFromDb(): Promise<LivePrice[] | null> {
  try {
    const rows = await db.goldPrice.findMany()
    if (rows.length < 8) return null
    const now = new Date().toISOString()
    return rows.map((row) => {
      const changePercent =
        row.openPrice > 0
          ? ((row.price - row.openPrice) / row.openPrice) * 100
          : 0
      return {
        symbol: row.symbol,
        name: row.name,
        unit: row.unit,
        price: row.price,
        openPrice: row.openPrice,
        changePercent,
        updatedAt: now,
      }
    })
  } catch {
    return null
  }
}

/** آخرین چاره: مقادیر پیش‌فرض ثابت */
function buildStatic(): LivePrice[] {
  const now = new Date().toISOString()
  return INSTRUMENTS.map((ins) => ({
    symbol: ins.symbol,
    name: ins.name,
    unit: ins.unit,
    price: ins.fallback,
    openPrice: ins.fallback,
    changePercent: 0,
    updatedAt: now,
  }))
}

async function persist(prices: LivePrice[]) {
  try {
    await Promise.all(
      prices.map((p) =>
        db.goldPrice.upsert({
          where: { symbol: p.symbol },
          update: { price: p.price, openPrice: p.openPrice },
          create: {
            symbol: p.symbol,
            name: p.name,
            unit: p.unit,
            basePrice: p.price,
            openPrice: p.openPrice,
            price: p.price,
          },
        })
      )
    )
  } catch {
    // کش پشتیبان حیاتی نیست
  }
}

/**
 * قیمت‌های زنده بازار — ابتدا tgju.org، سپس کش حافظه،
 * سپس آخرین مقادیر دیتابیس و در نهایت مقادیر ثابت.
 */
export async function getLivePrices(): Promise<LivePrice[]> {
  const now = Date.now()
  if (memCache && now - memCache.at < CACHE_TTL_MS) {
    return memCache.prices
  }

  const current = await fetchTgju()
  let prices: LivePrice[] | null = current ? buildFromTgju(current) : null

  if (prices) {
    void persist(prices)
  } else {
    prices = await buildFromDb()
  }
  if (!prices) prices = buildStatic()

  prices.sort(
    (a, b) => DISPLAY_ORDER.indexOf(a.symbol) - DISPLAY_ORDER.indexOf(b.symbol)
  )
  memCache = { at: now, prices }
  return prices
}
