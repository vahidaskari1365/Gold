"use client"

// فوتر مینیمال — چسبیده به پایین با mt-auto + نوار Marquee طلایی Magic UI
import { useView } from "@/lib/store"
import { usePrices } from "./prices-provider"
import type { SiteView } from "@/lib/store"
import { Marquee } from "@/components/magicui/marquee"

const LINKS: { id: SiteView; label: string }[] = [
  { id: "home", label: "خانه" },
  { id: "collection", label: "کالکشن" },
  { id: "plaque", label: "پلاک اختصاصی" },
  { id: "trade", label: "معامله طلا" },
  { id: "about", label: "درباره ما" },
]

const MARQUEE_WORDS = [
  "جواهرات",
  "سرویس",
  "سکه",
  "شمش",
  "طلای آب‌شده",
  "پلاک اختصاصی",
  "قیمت لحظه‌ای",
]

export function SiteFooter() {
  const setView = useView((s) => s.setView)
  const { updatedAt } = usePrices()

  return (
    <footer className="mt-auto border-t border-border/60 bg-[oklch(0.11_0.004_80/80%)] backdrop-blur-md">
      {/* نوار تزئینی متحرک Magic UI */}
      <div className="overflow-hidden border-b border-border/40" aria-hidden>
        <Marquee className="py-3 [--duration:55s] [--gap:0rem]" repeat={3} pauseOnHover>
          {MARQUEE_WORDS.map((w) => (
            <span
              key={w}
              className="mx-7 flex items-center gap-7 text-[11px] font-bold tracking-[0.25em] text-gold/45"
            >
              {w}
              <span className="text-gold/25">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        {/* برند */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative grid size-9 place-items-center">
              <span className="absolute inset-0 rotate-45 rounded-[10px] border border-gold/50" />
              <span className="gold-text text-lg font-black leading-none">آ</span>
            </span>
            <div className="leading-none">
              <div className="text-lg font-black">آرا</div>
              <div className="mt-1 text-[8px] tracking-[0.3em] text-muted-foreground">
                ARA GALLERY
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-xs leading-6 text-muted-foreground">
            گالری مینیمال طلا و جواهر — خرید، فروش و سفارش اختصاصی با قیمت زندهٔ
            بازار ایران و تضمین اصالت.
          </p>
        </div>

        {/* دسترسی سریع */}
        <nav aria-label="دسترسی سریع">
          <h3 className="text-xs font-black tracking-wider text-foreground/90">
            دسترسی سریع
          </h3>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => setView(l.id)}
                  className="text-xs text-muted-foreground transition-colors hover:text-gold"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* تماس */}
        <div>
          <h3 className="text-xs font-black tracking-wider text-foreground/90">تماس</h3>
          <ul className="mt-4 space-y-2.5 text-xs leading-6 text-muted-foreground">
            <li>تهران، خیابان ولیعصر، گالری آرا، پلاک ۲۱۴۸</li>
            <li dir="ltr" className="text-end">۰۲۱ - ۸۸ ۹۴ ۶۲ ۱۴</li>
            <li>شنبه تا پنجشنبه — ۱۰ صبح تا ۹ شب</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-[10px] text-muted-foreground/70 sm:flex-row md:px-6">
          <span>© ۱۴۰۴ گالری آرا — تمامی حقوق محفوظ است.</span>
          <span className="flex items-center gap-1.5">
            <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
            قیمت‌ها لحظه‌ای از tgju.org دریافت می‌شود
            {updatedAt ? "" : ""}
          </span>
        </div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  )
}
