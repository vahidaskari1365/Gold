"use client"

// صفحه‌ی خانه — سینمایی: هیرو، بازار امروز، منتخب، دسته‌ها، نقل‌قول، تیزر پلاک
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { useView, useShopUI } from "@/lib/store"
import { usePrices } from "../prices-provider"
import { AnimatedPrice } from "../count-up"
import { ProductCard, type ProductCardData } from "../product-card"
import { faDateTime, formatPercent } from "@/lib/format"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const MARKET: { symbol: string; unitFa: string }[] = [
  { symbol: "gold_18", unitFa: "گرم" },
  { symbol: "gold_24", unitFa: "گرم" },
  { symbol: "mesghal", unitFa: "مثقال" },
  { symbol: "coin_emami", unitFa: "عدد" },
  { symbol: "ounce", unitFa: "اونس" },
]

const CATEGORIES: { id: string; label: string; image: string; desc: string }[] = [
  { id: "jewelry", label: "جواهرات", image: "/images/ring.jpg", desc: "انگشتر، گردنبند، دستبند" },
  { id: "set", label: "سرویس", image: "/images/set.jpg", desc: "ست کامل و نیم‌ست" },
  { id: "coin", label: "سکه", image: "/images/coin1.jpg", desc: "امامی و بهار آزادی" },
  { id: "bar", label: "شمش", image: "/images/bar.jpg", desc: "سرمایه‌گذاری خالص" },
  { id: "melted", label: "آب‌شده", image: "/images/melted.jpg", desc: "با عیارسنجی رسمی" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: EASE },
  }),
}

export function HomeView() {
  const setView = useView((s) => s.setView)
  const setCategory = useShopUI((s) => s.setActiveCategory)
  const { map, updatedAt } = usePrices()
  const [featured, setFeatured] = useState<ProductCardData[]>([])
  const quoteRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: quoteRef,
    offset: ["start end", "end start"],
  })
  const quoteY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  useEffect(() => {
    let alive = true
    fetch("/api/products?featured=1", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.products) setFeatured(d.products)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const goCategory = (id: string) => {
    setCategory(id)
    setView("collection")
  }

  return (
    <div>
      {/* ─────────── هیرو سینمایی ─────────── */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-cine.jpg"
            alt="انگشتر طلای آرا در نور سینمایی"
            fill
            priority
            sizes="100vw"
            className="kenburns object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[oklch(0.12_0.004_80/92%)] via-[oklch(0.12_0.004_80/55%)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-[oklch(0.12_0.004_80/55%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-6 flex items-center gap-3"
          >
            <span className="gold-line w-12" />
            <span className="text-[11px] font-bold tracking-[0.35em] text-gold">
              گالری طلا و جواهر آرا
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="max-w-3xl text-[2.6rem] font-black leading-[1.18] tracking-tight md:text-7xl md:leading-[1.14]"
          >
            طلا، روایتِ
            <span className="gold-text"> جاودانِ </span>
            زیبایی
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground md:text-base"
          >
            خرید و فروش آنلاین جواهر، سکه، شمش و طلای آب‌شده — با قیمت زندهٔ
            بازار ایران، اصالت تضمینی و طراحی‌ای که فقط برای شما رقم می‌خورد.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => setView("collection")}
              className="group flex h-12 items-center gap-2 rounded-full px-7 text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface transition-transform duration-300 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              کاوش در کالکشن
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() => setView("trade")}
              className="h-12 rounded-full border border-border/80 px-7 text-sm font-bold text-foreground/85 backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              میز معامله طلا
            </button>
          </motion.div>

          {map["gold_18"] && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="glass mt-10 inline-flex items-center gap-3 rounded-full px-5 py-2.5"
            >
              <span className="live-dot inline-block size-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-muted-foreground">قیمت زندهٔ طلای ۱۸ عیار</span>
              <AnimatedPrice value={map["gold_18"].price} flash className="text-base font-black text-gold" />
              <span className="text-[9px] text-muted-foreground/70">تومان در گرم</span>
            </motion.div>
          )}
        </div>

        {/* نشانه‌ی اسکرول */}
        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
          <div className="flex h-12 w-7 items-start justify-center overflow-hidden rounded-full border border-border/70 pt-2">
            <div className="scroll-cue-line h-3 w-px bg-gold" />
          </div>
          <ChevronDown className="mx-auto mt-1 size-3 animate-bounce text-muted-foreground/60" />
        </div>
      </section>

      {/* ─────────── بازار امروز ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 flex flex-wrap items-end justify-between gap-3"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-gold">
              <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
              LIVE MARKET
            </div>
            <h2 className="text-2xl font-black md:text-3xl">بازارِ امروز</h2>
          </div>
          <div className="text-[10px] leading-5 text-muted-foreground">
            منبع: tgju.org
            {updatedAt ? ` — ${faDateTime(updatedAt)}` : ""}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {MARKET.map((m, i) => {
            const p = map[m.symbol]
            if (!p) {
              return (
                <div key={m.symbol} className="glass h-[104px] animate-pulse rounded-2xl" />
              )
            }
            const up = p.changePercent >= 0
            return (
              <motion.div
                key={m.symbol}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                className="glass rounded-2xl p-4 transition-colors duration-300 hover:border-gold/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{p.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums ${
                      up ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                    }`}
                    dir="ltr"
                  >
                    {up ? "▲" : "▼"} {formatPercent(p.changePercent)}
                  </span>
                </div>
                <div className="mt-2.5">
                  <AnimatedPrice value={p.price} flash className="text-xl font-black text-foreground" />
                  <span className="ms-1 text-[9px] text-muted-foreground/70">
                    {m.symbol === "ounce" ? "دلار" : "تومان"}
                  </span>
                </div>
                <div className="mt-1 text-[9px] text-muted-foreground/60">
                  هر {m.unitFa}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ─────────── منتخب کالکشن ─────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">
                SELECTION
              </div>
              <h2 className="text-2xl font-black md:text-3xl">منتخبِ کالکشن</h2>
            </div>
            <button
              onClick={() => setView("collection")}
              className="group flex items-center gap-1.5 text-xs font-bold text-gold outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              مشاهده همه
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </motion.div>

          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            {featured.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[230px] shrink-0 animate-pulse rounded-2xl border border-border/50 bg-card/40"
                    style={{ aspectRatio: "4/5.9" }}
                  />
                ))
              : featured.map((p, i) => (
                  <div key={p.id} className="w-[230px] shrink-0 snap-start md:w-[250px]">
                    <ProductCard
                      product={p}
                      index={i}
                      compact
                      onOpen={() => {
                        setCategory("all")
                        setView("collection")
                      }}
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ─────────── دسته‌بندی‌ها ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">CATEGORIES</div>
          <h2 className="text-2xl font-black md:text-3xl">دنیایِ آرا را کاوش کنید</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
              onClick={() => goCategory(c.id)}
              className="group relative h-44 overflow-hidden rounded-2xl border border-border/60 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-52"
              aria-label={`مشاهده ${c.label}`}
            >
              <Image
                src={c.image}
                alt={c.label}
                fill
                sizes="(max-width:768px) 50vw, 20vw"
                className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0.004_80/92%)] via-[oklch(0.11_0.004_80/30%)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-sm font-black text-foreground">{c.label}</div>
                <div className="mt-0.5 text-[9px] text-muted-foreground">{c.desc}</div>
                <div className="mt-2 h-px w-8 bg-gold/70 transition-all duration-500 group-hover:w-16" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ─────────── نقل‌قول پارالاکس ─────────── */}
      <section ref={quoteRef} className="relative overflow-hidden py-28 md:py-36">
        <motion.div style={{ y: quoteY }} className="absolute inset-0 -z-10 scale-[1.2]">
          <Image
            src="/images/atelier.jpg"
            alt="کارگاه ساخت طلا"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.12_0.004_80/70%)] to-background" />
        </motion.div>
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <p className="font-amiri text-2xl leading-[2.2] text-foreground/95 md:text-4xl md:leading-[2]">
            «طلا، زبانِ مشترکِ تمدن‌هاست؛
            <br />
            و ما گویندگانِ این زبانیم»
          </p>
          <div className="mx-auto mt-8 flex w-fit items-center gap-3">
            <span className="gold-line w-10" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-gold">استودیوی آرا</span>
            <span className="gold-line w-10" />
          </div>
        </motion.blockquote>
      </section>

      {/* ─────────── تیزر پلاک اختصاصی ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="glass grid overflow-hidden rounded-3xl md:grid-cols-2"
        >
          <div className="relative min-h-64 md:min-h-[380px]">
            <Image
              src="/images/plaque.jpg"
              alt="پلاک طلای اختصاصی"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-3 text-[10px] font-bold tracking-[0.3em] text-gold">
              ATELIER — پلاک اختصاصی
            </div>
            <h2 className="text-2xl font-black leading-relaxed md:text-4xl md:leading-relaxed">
              پلاکی که فقط
              <span className="gold-text"> داستانِ شماست</span>
            </h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              متن دلخواه، خط خوشنویسی، فرم، رنگ طلا و وزن — همه را خودتان انتخاب
              کنید؛ استودیوی آرا آن را با دست می‌سازد و قیمت را با نرخ زندهٔ روز
              محاسبه می‌کند.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["۵ فرم اختصاصی", "۳ سبک خوشنویسی", "۳ رنگ طلا", "وزن دلخواه"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/70 px-3 py-1.5 text-[10px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => setView("plaque")}
              className="group mt-7 flex h-12 w-fit items-center gap-2 rounded-full px-7 text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface transition-transform duration-300 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              طراحی پلاک شما
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
