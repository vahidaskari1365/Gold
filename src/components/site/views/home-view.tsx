"use client"

// صفحه‌ی خانه — سینمایی با کامپوننت‌های Magic UI
// (اقتباس از github.com/magicuidesign/magicui)
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { useView, useShopUI } from "@/lib/store"
import { usePrices } from "../prices-provider"
import { AnimatedPrice } from "../count-up"
import { ProductCard, type ProductCardData } from "../product-card"
import { faDateTime, formatPercent } from "@/lib/format"
import { BlurFade } from "@/components/magicui/blur-fade"
import { WordRotate } from "@/components/magicui/word-rotate"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { MagicCard } from "@/components/magicui/magic-card"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Meteors } from "@/components/magicui/meteors"
import { OrbitingCircles } from "@/components/magicui/orbiting-circles"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { NumberTicker } from "@/components/magicui/number-ticker"

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

const ROTATE_WORDS = ["جاودانِ", "درخشانِ", "اصیلِ", "ماندگارِ"]

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
      {/* ─────────── هیرو سینمایی Magic ─────────── */}
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

        {/* شهاب‌های طلایی */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Meteors number={12} minDelay={0.4} maxDelay={2.4} minDuration={5} maxDuration={11} angle={215} className="opacity-60" />
        </div>

        {/* مدار طلایی چرخان دور سکه — دسکتاپ */}
        <div
          className="absolute left-[3%] top-1/2 hidden -translate-y-1/2 xl:block"
          aria-hidden
        >
          <div className="relative size-[400px]">
            <OrbitingCircles radius={196} duration={30} iconSize={34} path>
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full bg-gold/85 shadow-[0_0_14px_oklch(0.8_0.11_85/75%)]"
                />
              ))}
            </OrbitingCircles>
            <OrbitingCircles radius={132} duration={20} reverse iconSize={26} path={false}>
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-gold-light/70 shadow-[0_0_10px_oklch(0.89_0.07_92/70%)]"
                />
              ))}
            </OrbitingCircles>
            <div className="absolute inset-0 grid place-items-center">
              <div className="float-soft relative size-52 overflow-hidden rounded-full border border-gold/30 shadow-[0_0_90px_-12px_oklch(0.8_0.11_85/50%)]">
                <Image
                  src="/images/coin1.jpg"
                  alt="سکه طلای آرا"
                  fill
                  sizes="208px"
                  className="object-cover"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[oklch(0.12_0.004_80/55%)] to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
          <BlurFade delay={0.05} duration={0.7} direction="up" offset={14}>
            <div className="glass group mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
              <span className="live-dot inline-block size-2 rounded-full bg-emerald-400" />
              <AnimatedShinyText className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider">
                <span>قیمت لحظه‌ای بازار طلا</span>
                <AnimatedGradientText className="font-black">tgju.org</AnimatedGradientText>
              </AnimatedShinyText>
            </div>
          </BlurFade>

          <BlurFade delay={0.15} duration={0.8} direction="up" offset={18}>
            <h1 className="max-w-3xl text-[2.6rem] font-black leading-[1.18] tracking-tight md:text-7xl md:leading-[1.14]">
              طلا، روایتِ{" "}
              <WordRotate
                words={ROTATE_WORDS}
                duration={2600}
                className="gold-text"
                motionProps={{
                  initial: { opacity: 0, y: -32, filter: "blur(6px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: 32, filter: "blur(6px)" },
                  transition: { duration: 0.4, ease: EASE },
                }}
              />{" "}
              زیبایی
            </h1>
          </BlurFade>

          <BlurFade delay={0.28} duration={0.8} direction="up" offset={16}>
            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground md:text-base">
              خرید و فروش آنلاین جواهر، سکه، شمش و طلای آب‌شده — با قیمت زندهٔ
              بازار ایران، اصالت تضمینی و طراحی‌ای که فقط برای شما رقم می‌خورد.
            </p>
          </BlurFade>

          <BlurFade delay={0.4} duration={0.8} direction="up" offset={16}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ShimmerButton
                onClick={() => setView("collection")}
                background="linear-gradient(120deg, oklch(0.55 0.09 78) 0%, oklch(0.78 0.11 85) 35%, oklch(0.92 0.06 94) 55%, oklch(0.78 0.11 85) 75%, oklch(0.55 0.09 78) 100%)"
                shimmerColor="rgba(255,252,235,0.9)"
                className="h-12 px-7 text-sm font-black text-[oklch(0.15_0.02_80)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                shimmerDuration="4s"
              >
                کاوش در کالکشن
                <ArrowLeft className="ms-2 size-4" />
              </ShimmerButton>
              <button
                onClick={() => setView("trade")}
                className="h-12 rounded-full border border-border/80 px-7 text-sm font-bold text-foreground/85 backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                میز معامله طلا
              </button>
            </div>
          </BlurFade>

          {map["gold_18"] && (
            <BlurFade delay={0.52} duration={0.8} direction="up" offset={14}>
              <div className="glass relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-2.5">
                <span className="live-dot inline-block size-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-muted-foreground">
                  قیمت زندهٔ طلای ۱۸ عیار
                </span>
                <NumberTicker
                  value={map["gold_18"].price}
                  className="text-base font-black text-gold"
                />
                <span className="text-[9px] text-muted-foreground/70">تومان در گرم</span>
                <BorderBeam size={42} duration={5} delay={1.2} className="opacity-80" />
              </div>
            </BlurFade>
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

      {/* ─────────── بازار امروز — MagicCard + NumberTicker ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <BlurFade inView duration={0.6} offset={18} direction="up">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
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
          </div>
        </BlurFade>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {MARKET.map((m, i) => {
            const p = map[m.symbol]
            if (!p) {
              return (
                <div key={m.symbol} className="glass h-[104px] animate-pulse rounded-2xl" />
              )
            }
            const up = p.changePercent >= 0
            const isGold18 = m.symbol === "gold_18"
            return (
              <BlurFade
                key={m.symbol}
                inView
                duration={0.55}
                delay={i * 0.07}
                offset={14}
              >
                <MagicCard
                  className="relative h-full rounded-2xl"
                  gradientSize={190}
                  gradientColor="#2b2210"
                  gradientOpacity={0.6}
                  gradientFrom="#e9cd7e"
                  gradientTo="#96731f"
                >
                  <div className="relative flex h-full flex-col rounded-2xl p-4">
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
                      <NumberTicker
                        value={p.price}
                        className="text-xl font-black text-foreground"
                      />
                      <span className="ms-1 text-[9px] text-muted-foreground/70">
                        {m.symbol === "ounce" ? "دلار" : "تومان"}
                      </span>
                    </div>
                    <div className="mt-1 text-[9px] text-muted-foreground/60">
                      هر {m.unitFa}
                    </div>
                    {isGold18 && (
                      <BorderBeam
                        size={44}
                        duration={6}
                        colorFrom="#f7e7b8"
                        colorTo="#b8860b"
                      />
                    )}
                  </div>
                </MagicCard>
              </BlurFade>
            )
          })}
        </div>
      </section>

      {/* ─────────── منتخب کالکشن ─────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <BlurFade inView duration={0.6} offset={16} direction="up">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">
                  SELECTION
                </div>
                <h2 className="text-2xl font-black md:text-3xl">منتخبِ کالکشن</h2>
              </div>
              <button
                onClick={() => setView("collection")}
                className="group flex items-center gap-1.5 rounded text-xs font-bold text-gold outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                مشاهده همه
                <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
            </div>
          </BlurFade>

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

      {/* ─────────── دسته‌بندی‌ها — حاشیهٔ طلایی دنبال‌کنندهٔ موس ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <BlurFade inView duration={0.6} offset={16} direction="up">
          <div className="mb-8">
            <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">
              CATEGORIES
            </div>
            <h2 className="text-2xl font-black md:text-3xl">دنیایِ آرا را کاوش کنید</h2>
          </div>
        </BlurFade>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <BlurFade key={c.id} inView duration={0.55} delay={i * 0.07} offset={16}>
              <MagicCard
                className="h-full rounded-2xl"
                gradientSize={230}
                gradientColor="#241d10"
                gradientOpacity={0.45}
                gradientFrom="#e9cd7e"
                gradientTo="#96731f"
              >
                <button
                  onClick={() => goCategory(c.id)}
                  className="group relative block h-44 w-full overflow-hidden rounded-2xl text-start outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-52"
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
                </button>
              </MagicCard>
            </BlurFade>
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
        <BlurFade inView duration={0.8} offset={20} direction="up">
          <blockquote className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-amiri text-2xl leading-[2.2] text-foreground/95 md:text-4xl md:leading-[2]">
              «طلا، زبانِ مشترکِ تمدن‌هاست؛
              <br />
              و ما گویندگانِ این زبانیم»
            </p>
            <div className="mx-auto mt-8 flex w-fit items-center gap-3">
              <span className="gold-line w-10" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-gold">
                استودیوی آرا
              </span>
              <span className="gold-line w-10" />
            </div>
          </blockquote>
        </BlurFade>
      </section>

      {/* ─────────── تیزر پلاک اختصاصی — MagicCard orb + BorderBeam ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <BlurFade inView duration={0.7} offset={20} direction="up">
          <MagicCard
            mode="orb"
            glowFrom="#f3d27a"
            glowTo="#8a6d1d"
            glowSize={520}
            glowBlur={90}
            glowOpacity={0.55}
            gradientFrom="#e9cd7e"
            gradientTo="#96731f"
            className="grid overflow-hidden rounded-3xl md:grid-cols-2"
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
              <SparklesText
                sparklesCount={6}
                className="text-2xl font-black leading-relaxed text-foreground md:text-4xl md:leading-relaxed [&_strong]:font-black"
              >
                پلاکی که فقط داستانِ شماست
              </SparklesText>
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
              <ShimmerButton
                onClick={() => setView("plaque")}
                background="linear-gradient(120deg, oklch(0.55 0.09 78) 0%, oklch(0.78 0.11 85) 35%, oklch(0.92 0.06 94) 55%, oklch(0.78 0.11 85) 75%, oklch(0.55 0.09 78) 100%)"
                shimmerColor="rgba(255,252,235,0.9)"
                className="mt-7 h-12 w-fit px-7 text-sm font-black text-[oklch(0.15_0.02_80)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                shimmerDuration="4s"
              >
                طراحی پلاک شما
                <ArrowLeft className="ms-2 size-4" />
              </ShimmerButton>
            </div>
            <BorderBeam
              size={90}
              duration={9}
              colorFrom="#f7e7b8"
              colorTo="#b8860b"
              borderWidth={1.5}
            />
          </MagicCard>
        </BlurFade>
      </section>
    </div>
  )
}
