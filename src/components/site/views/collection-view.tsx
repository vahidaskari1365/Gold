"use client"

// صفحه‌ی کالکشن — فیلتر دسته، مرتب‌سازی، گرید مدرن، نمای سریع
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useShopUI, useCart } from "@/lib/store"
import { ProductCard, type ProductCardData } from "../product-card"
import { usePrices } from "../prices-provider"
import { computeItemPrice, calcProductPrice, gramPriceByKarat } from "@/lib/gold-calc"
import { formatToman, faNumber } from "@/lib/format"
import { toast } from "@/hooks/use-toast"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { BorderBeam } from "@/components/magicui/border-beam"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CHIPS: { id: string; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "jewelry", label: "جواهرات" },
  { id: "set", label: "سرویس" },
  { id: "coin", label: "سکه" },
  { id: "bar", label: "شمش" },
  { id: "melted", label: "آب‌شده" },
]

const CAT_FA: Record<string, string> = {
  jewelry: "جواهر",
  set: "سرویس",
  coin: "سکه",
  bar: "شمش",
  melted: "آب‌شده",
}

type ApiProduct = ProductCardData & { makingFee: number; profit: number; tax: number }

export function CollectionView() {
  const { activeCategory, setActiveCategory } = useShopUI()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("default")
  const [selected, setSelected] = useState<ApiProduct | null>(null)
  const { map } = usePrices()
  const add = useCart((s) => s.add)

  useEffect(() => {
    let alive = true
    fetch("/api/products", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return
        if (d?.products) setProducts(d.products)
        setLoading(false)
      })
      .catch(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const visible = useMemo(() => {
    let list = products
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory)
    const priced = list.map((p) => ({ ...p, livePrice: computeItemPrice(p, map) }))
    if (sort === "cheap") priced.sort((a, b) => a.livePrice - b.livePrice)
    else if (sort === "expensive") priced.sort((a, b) => b.livePrice - a.livePrice)
    return priced
  }, [products, activeCategory, sort, map])

  const breakdown = (p: ApiProduct) => {
    if (p.category === "jewelry" || p.category === "set") {
      const gram = gramPriceByKarat(map, p.karat)
      return calcProductPrice({
        gramPrice: gram,
        weight: p.weight,
        makingFee: p.makingFee,
        profit: p.profit,
        tax: p.tax ?? 9,
      })
    }
    return null
  }

  const quickAdd = (p: ApiProduct) => {
    add(
      {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.image,
        category: p.category,
        weight: p.weight,
        karat: p.karat,
        makingFee: p.makingFee ?? 0,
        profit: p.profit ?? 0,
        stock: Math.max(1, p.stock),
      },
      1
    )
    toast({ title: "به سبد اضافه شد ✨", description: p.name })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      {/* سربرگ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">THE COLLECTION</div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-black md:text-5xl">کالکشنِ آرا</h1>
          <p className="text-xs text-muted-foreground">
            {faNumber(visible.length)} اثر — قیمت‌ها با نرخ زندهٔ بازار به‌روز می‌شوند
          </p>
        </div>
        <div className="gold-line mt-6" />
      </motion.div>

      {/* فیلترها */}
      <div className="sticky top-[88px] z-30 -mx-4 mt-6 bg-background/80 px-4 py-3 backdrop-blur-lg md:top-[100px] md:-mx-6 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {CHIPS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeCategory === c.id
                    ? "border-gold bg-gold text-[oklch(0.15_0.02_80)]"
                    : "border-border/70 text-muted-foreground hover:border-gold/40 hover:text-gold"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              size="sm"
              className="w-36 shrink-0 rounded-full border-border/70 bg-card/60 text-xs"
              aria-label="مرتب‌سازی"
            >
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">جدیدترین</SelectItem>
              <SelectItem value="cheap">ارزان‌ترین</SelectItem>
              <SelectItem value="expensive">گران‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* گرید محصولات */}
      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-border/40 bg-card/30"
              style={{ aspectRatio: "4/5.9" }}
            />
          ))}
        </div>
      ) : (
        <motion.div layout className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <ProductCard product={p} index={i} onOpen={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && visible.length === 0 && (
        <div className="py-24 text-center text-sm text-muted-foreground">
          در این دسته فعلاً اثری موجود نیست.
        </div>
      )}

      {/* نمای سریع محصول */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-[oklch(0.14_0.004_80)] p-0 sm:max-w-2xl">
          {selected && (
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-square sm:aspect-auto sm:min-h-[420px]">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  sizes="(max-width:640px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-l" />
              </div>
              <div className="flex flex-col p-6">
                <DialogHeader className="space-y-2 text-start">
                  <div className="text-[9px] font-bold tracking-[0.25em] text-gold">
                    {CAT_FA[selected.category] ?? selected.category}
                    {selected.subCategory ? ` — ${selected.subCategory}` : ""}
                  </div>
                  <DialogTitle className="text-lg font-black">{selected.name}</DialogTitle>
                  <DialogDescription className="text-xs leading-6">
                    {selected.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/70 px-3 py-1 text-[10px]">
                    وزن: {faNumber(selected.weight, 2)} گرم
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-[10px]">
                    {selected.karat === 900 ? "عیار ۹۰۰" : `${faNumber(selected.karat)} عیار`}
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-[10px]">
                    موجودی: {faNumber(selected.stock)} عدد
                  </span>
                </div>

                <div className="relative mt-5 space-y-2 overflow-hidden rounded-2xl border border-border/60 bg-black/20 p-4 text-xs">
                  {breakdown(selected) ? (
                    <>
                      <Row label="ارزش طلای خالص" value={breakdown(selected)!.base} />
                      <Row label="اجرت ساخت" value={breakdown(selected)!.fee} />
                      <Row label="سود فروشنده" value={breakdown(selected)!.profit} />
                      <Row label="مالیات بر ارزش افزوده" value={breakdown(selected)!.tax} />
                    </>
                  ) : (
                    <Row
                      label={
                        selected.category === "coin"
                          ? "قیمت مستقل سکه در بازار"
                          : "قیمت مستقل بر اساس نرخ بازار"
                      }
                      value={computeItemPrice(selected, map)}
                      muted
                    />
                  )}
                  <div className="gold-line my-1" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold">قیمت نهایی</span>
                    <span className="text-base font-black tabular-nums gold-text">
                      <NumberTicker value={computeItemPrice(selected, map)} /> تومان
                    </span>
                  </div>
                  <BorderBeam size={40} duration={8} colorFrom="#f7e7b8" colorTo="#b8860b" className="opacity-70" />
                </div>

                <Button
                  onClick={() => {
                    quickAdd(selected)
                    setSelected(null)
                  }}
                  className="mt-5 h-11 w-full rounded-full text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface hover:opacity-90"
                >
                  افزودن به سبد خرید
                </Button>
                <p className="mt-3 text-center text-[9px] text-muted-foreground/70">
                  محاسبه بر اساس قیمت زندهٔ <span dir="ltr">tgju.org</span> — پرداخت پس از تماس کارشناس
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : "text-muted-foreground/80"}>{label}</span>
      <span className="tabular-nums text-foreground/85">{formatToman(value)}</span>
    </div>
  )
}
