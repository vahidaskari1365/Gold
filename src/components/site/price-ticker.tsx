"use client"

// نوار قیمت لحظه‌ای — Magic UI Marquee (اقتباس از github.com/magicuidesign/magicui)
import { Marquee } from "../magicui/marquee"
import { usePrices } from "./prices-provider"
import { AnimatedPrice } from "./count-up"
import { formatPercent, faTime } from "@/lib/format"

const TICKER_SYMBOLS = [
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

function TickerItem({ symbol }: { symbol: string }) {
  const { map } = usePrices()
  const p = map[symbol]
  if (!p) return null
  const up = p.changePercent >= 0
  return (
    <span className="mx-5 flex items-center gap-2 text-[11px] leading-none">
      <span className="text-muted-foreground">{p.name}</span>
      <AnimatedPrice
        value={p.price}
        className="font-bold text-foreground/90"
        flash
      />
      <span className="text-[9px] text-muted-foreground/70">تومان</span>
      <span
        className={`tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}
        dir="ltr"
      >
        {up ? "▲" : "▼"} {formatPercent(p.changePercent)}
      </span>
      <span className="ms-3 text-[oklch(0.8_0.11_85/40%)]">✦</span>
    </span>
  )
}

export function PriceTicker() {
  const { prices, updatedAt, loading } = usePrices()
  const row = TICKER_SYMBOLS.map((s) => <TickerItem key={s} symbol={s} />)

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-8 overflow-hidden border-b border-border/60 bg-[oklch(0.11_0.004_80/92%)] backdrop-blur-md">
      <div className="flex h-full items-center">
        <div className="z-10 flex h-full shrink-0 items-center gap-2 border-e border-border/60 bg-[oklch(0.13_0.004_80)] px-3 text-[10px] font-bold text-gold">
          <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
          لحظه‌ای
        </div>
        <div className="relative flex-1 overflow-hidden">
          {loading && prices.length === 0 ? (
            <div className="flex h-full items-center px-5 text-[11px] text-muted-foreground/60">
              در حال دریافت قیمت‌های زنده از tgju.org…
            </div>
          ) : (
            <>
              {/* محو شدن لبه‌ها */}
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[oklch(0.11_0.004_80)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[oklch(0.11_0.004_80)] to-transparent" />
              <Marquee
                className="h-8 items-center p-0 [--duration:48s] [--gap:0rem]"
                pauseOnHover
                repeat={3}
              >
                {row}
              </Marquee>
            </>
          )}
        </div>
        {updatedAt && (
          <div className="z-10 hidden h-full shrink-0 items-center border-s border-border/60 px-3 text-[9px] tabular-nums text-muted-foreground/70 sm:flex">
            به‌روزرسانی {faTime(updatedAt)}
          </div>
        )}
      </div>
    </div>
  )
}
