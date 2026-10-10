"use client"

// هدر مینیمال — روتر مجازی، نشانگر متحرک، سبد خرید
import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Menu } from "lucide-react"
import { useView, useCart, type SiteView } from "@/lib/store"
import { usePrices } from "./prices-provider"
import { AnimatedPrice } from "./count-up"
import { faNumber } from "@/lib/format"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

const NAV: { id: SiteView; label: string }[] = [
  { id: "home", label: "خانه" },
  { id: "collection", label: "کالکشن" },
  { id: "plaque", label: "پلاک اختصاصی" },
  { id: "trade", label: "معامله طلا" },
  { id: "about", label: "درباره ما" },
]

export function SiteHeader() {
  const { view, setView } = useView()
  const items = useCart((s) => s.items)
  const openCart = useCart((s) => s.open)
  const { map } = usePrices()
  const [menuOpen, setMenuOpen] = useState(false)
  const gold18 = map["gold_18"]
  const count = items.reduce((s, i) => s + i.qty, 0)

  const go = (v: SiteView) => {
    setView(v)
    setMenuOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-8 z-50 border-b border-border/60 bg-[oklch(0.125_0.004_80/86%)] backdrop-blur-xl md:top-9">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:h-16 md:px-6">
        {/* لوگو */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label="آرا — صفحه اصلی"
        >
          <span className="relative grid size-9 place-items-center">
            <span className="absolute inset-0 rotate-45 rounded-[10px] border border-gold/50" />
            <span className="gold-text text-lg font-black leading-none">آ</span>
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-lg font-black tracking-tight">آرا</span>
            <AnimatedShinyText
              shimmerWidth={70}
              className="text-[8px] font-medium tracking-[0.3em]"
            >
              ARA GALLERY
            </AnimatedShinyText>
          </span>
        </button>

        {/* ناوبری دسکتاپ */}
        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`relative pb-1 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                view === n.id ? "text-gold" : "text-foreground/75 hover:text-foreground"
              }`}
              aria-current={view === n.id ? "page" : undefined}
            >
              {n.label}
              {view === n.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-l from-transparent via-gold to-transparent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* اکشن‌ها */}
        <div className="flex items-center gap-2.5">
          {gold18 && (
            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 lg:flex">
              <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-muted-foreground">طلای ۱۸</span>
              <AnimatedPrice
                value={gold18.price}
                flash
                className="text-xs font-black text-gold"
              />
              <span className="text-[8px] text-muted-foreground/70">تومان</span>
            </div>
          )}

          <button
            onClick={openCart}
            className="relative grid size-10 place-items-center rounded-full border border-border/70 text-foreground/85 transition-colors hover:border-gold/50 hover:text-gold outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`سبد خرید${count ? ` — ${faNumber(count)} کالا` : ""}
`}
          >
            <ShoppingBag className="size-[17px]" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -left-1 -top-1 grid min-w-4.5 place-items-center rounded-full bg-gold px-1 text-[9px] font-black leading-[1.4] text-[oklch(0.15_0.02_80)]"
              >
                {faNumber(count)}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="grid size-10 place-items-center rounded-full border border-border/70 text-foreground/85 transition-colors hover:border-gold/50 hover:text-gold md:hidden outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="باز کردن منو"
          >
            <Menu className="size-[17px]" />
          </button>
        </div>
      </div>

      {/* منوی موبایل */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="w-full border-border/60 bg-[oklch(0.125_0.004_80/97%)] backdrop-blur-xl sm:max-w-xs"
        >
          <SheetHeader className="border-b border-border/60 pb-4 text-start">
            <SheetTitle className="gold-text text-2xl font-black">آرا</SheetTitle>
            <SheetDescription className="text-[10px] tracking-[0.3em]">
              گالری طلا و جواهر
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="منوی موبایل" className="flex flex-col gap-1 px-4 py-6">
            {NAV.map((n, i) => (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.35 }}
                onClick={() => go(n.id)}
                className={`rounded-xl px-4 py-3.5 text-start text-base font-bold transition-colors ${
                  view === n.id
                    ? "bg-gold/10 text-gold"
                    : "text-foreground/80 hover:bg-white/5"
                }`}
              >
                {n.label}
              </motion.button>
            ))}
          </nav>
          {gold18 && (
            <div className="mx-4 mt-auto mb-6 flex items-center justify-between rounded-2xl border border-border/60 bg-card/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-muted-foreground">طلای ۱۸ عیار</span>
              </div>
              <AnimatedPrice
                value={gold18.price}
                flash
                className="text-sm font-black text-gold"
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  )
}
