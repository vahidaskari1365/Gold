"use client"

// استودیوی پلاک اختصاصی — پیش‌نمایش زنده SVG + فرم سفارش
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { usePrices } from "../prices-provider"
import { gramPriceByKarat } from "@/lib/gold-calc"
import { formatToman, faNumber } from "@/lib/format"
import { toast } from "@/hooks/use-toast"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Shape = "rectangle" | "oval" | "circle" | "heart" | "star"
type Calligraphy = "nastaliq" | "thulth" | "modern"
type GoldColor = "yellow" | "rose" | "white"

const SHAPES: { id: Shape; label: string }[] = [
  { id: "rectangle", label: "مستطیل" },
  { id: "oval", label: "بیضی" },
  { id: "circle", label: "دایره" },
  { id: "heart", label: "قلب" },
  { id: "star", label: "ستاره" },
]

const CALLIGRAPHY: { id: Calligraphy; label: string; cls: string }[] = [
  { id: "nastaliq", label: "نستعلیق", cls: "font-nastaliq" },
  { id: "thulth", label: "ثلث", cls: "font-amiri" },
  { id: "modern", label: "مدرن", cls: "font-vazir" },
]

const COLORS: { id: GoldColor; label: string; stops: [string, string, string]; text: string }[] = [
  {
    id: "yellow",
    label: "طلای زرد",
    stops: ["#F8E27E", "#D9AC4F", "#96701F"],
    text: "#4A3410",
  },
  {
    id: "rose",
    label: "رزگلد",
    stops: ["#F9CFBB", "#DEA084", "#A56A52"],
    text: "#54352A",
  },
  {
    id: "white",
    label: "طلای سفید",
    stops: ["#F8F8F5", "#D8DAD9", "#9AA0A7"],
    text: "#3B4048",
  },
]

function starPoints(): string {
  const cx = 180
  const cy = 158
  const R = 98
  const r = 43
  const pts: string[] = []
  for (let k = 0; k < 5; k++) {
    const ao = ((-90 + 72 * k) * Math.PI) / 180
    const ai = (((-90 + 72 * k + 36) * Math.PI) / 180)
    pts.push(`${(cx + R * Math.cos(ao)).toFixed(1)},${(cy + R * Math.sin(ao)).toFixed(1)}`)
    pts.push(`${(cx + r * Math.cos(ai)).toFixed(1)},${(cy + r * Math.sin(ai)).toFixed(1)}`)
  }
  return pts.join(" ")
}

function PlaqueSvg(props: {
  text: string
  shape: Shape
  calligraphy: Calligraphy
  color: GoldColor
  withChain: boolean
}) {
  const { text, shape, calligraphy, color, withChain } = props
  const conf = COLORS.find((c) => c.id === color) ?? COLORS[0]
  const fontCls = CALLIGRAPHY.find((c) => c.id === calligraphy)?.cls ?? "font-vazir"
  const fontSize = text.length <= 5 ? 36 : text.length <= 9 ? 27 : text.length <= 14 ? 20 : 15

  return (
    <svg viewBox="0 0 360 300" className="w-full" role="img" aria-label="پیش‌نمایش پلاک">
      <defs>
        <linearGradient id={`gold-${color}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={conf.stops[0]} />
          <stop offset="45%" stopColor={conf.stops[1]} />
          <stop offset="100%" stopColor={conf.stops[2]} />
        </linearGradient>
        <linearGradient id="chain-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8cd82" />
          <stop offset="100%" stopColor="#8a6d2f" />
        </linearGradient>
        <filter id="plaque-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      {withChain && (
        <path
          d="M 96 96 C 76 58 118 26 180 24 C 242 26 284 58 264 96"
          fill="none"
          stroke="url(#chain-g)"
          strokeWidth="4"
          strokeDasharray="7 5"
          strokeLinecap="round"
        />
      )}

      <g filter="url(#plaque-shadow)">
        {shape === "rectangle" && (
          <rect x="72" y="88" width="216" height="132" rx="20" fill={`url(#gold-${color})`} />
        )}
        {shape === "oval" && <ellipse cx="180" cy="154" rx="112" ry="76" fill={`url(#gold-${color})`} />}
        {shape === "circle" && <circle cx="180" cy="154" r="86" fill={`url(#gold-${color})`} />}
        {shape === "heart" && (
          <path
            d="M180 236 C 118 190, 84 148, 84 112 C 84 80, 112 62, 140 62 C 160 62, 174 72, 180 86 C 186 72, 200 62, 220 62 C 248 62, 276 80, 276 112 C 276 148, 242 190, 180 236 Z"
            fill={`url(#gold-${color})`}
          />
        )}
        {shape === "star" && (
          <polygon points={starPoints()} fill={`url(#gold-${color})`} strokeLinejoin="round" stroke={conf.stops[1]} strokeWidth="3" />
        )}
      </g>

      {/* حاشیه‌ی داخلی ظریف */}
      {shape === "rectangle" && (
        <rect x="82" y="98" width="196" height="112" rx="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      )}

      <text
        x="180"
        y={shape === "heart" ? 150 : 158}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`${fontCls} engraved`}
        fontSize={fontSize}
        fontWeight="800"
        fill={conf.text}
      >
        {text || "متن شما"}
      </text>
    </svg>
  )
}

export function PlaqueView() {
  const { map } = usePrices()
  const [text, setText] = useState("")
  const [shape, setShape] = useState<Shape>("rectangle")
  const [calligraphy, setCalligraphy] = useState<Calligraphy>("nastaliq")
  const [color, setColor] = useState<GoldColor>("yellow")
  const [weight, setWeight] = useState(6)
  const [karat, setKarat] = useState(18)
  const [withChain, setWithChain] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ orderCode: string; totalPrice: number } | null>(null)

  const gram = gramPriceByKarat(map, karat)
  const gold18 = map["gold_18"]?.price ?? 0
  const base = gram * weight
  const fee = base * 0.15
  const chainCost = withChain ? 2.5 * gold18 : 0
  const total = useMemo(() => Math.round(base + fee + chainCost), [base, fee, chainCost])

  const submit = async () => {
    if (!text.trim()) {
      toast({ title: "متن پلاک را وارد کنید", variant: "destructive" })
      return
    }
    if (name.trim().length < 2) {
      toast({ title: "نام خود را وارد کنید", variant: "destructive" })
      return
    }
    const normalized = phone
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[\s-]/g, "")
    if (!/^(\+98|0|0098)?9\d{9}$/.test(normalized)) {
      toast({ title: "شماره موبایل معتبر نیست", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone: normalized,
          plaqueText: text.trim(),
          shape,
          calligraphy,
          goldColor: color,
          weight,
          karat,
          withChain,
          note: note || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "خطا در ثبت سفارش")
      setSuccess({ orderCode: data.orderCode, totalPrice: data.totalPrice })
      toast({ title: "سفارش پلاک ثبت شد ✨", description: `کد پیگیری: ${data.orderCode}` })
    } catch (e) {
      toast({
        title: "خطا در ثبت سفارش",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-10"
      >
        <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">ATELIER STUDIO</div>
        <h1 className="text-3xl font-black md:text-5xl">
          استودیوی <span className="gold-text">پلاک اختصاصی</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground">
          متن دلخواهتان را بنویسید، سبک خوشنویسی، فرم، رنگ طلا و وزن را انتخاب کنید —
          پیش‌نمایش زنده همان چیزی است که دست استادکار ما ساخته خواهد کرد.
        </p>
        <div className="gold-line mt-6" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* پیش‌نمایش زنده */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
            <div className="sheen absolute inset-0 rounded-3xl" />
            <PlaqueSvg
              text={text}
              shape={shape}
              calligraphy={calligraphy}
              color={color}
              withChain={withChain}
            />
            <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-muted-foreground/60">
              <Sparkles className="size-3 text-gold/70" />
              پیش‌نمایش تقریبی — ساخت نهایی با دست استادکار انجام می‌شود
            </div>
          </div>

          {/* تفکیک قیمت */}
          <div className="glass mt-4 rounded-3xl p-5">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ارزش طلا ({faNumber(weight, 1)} گرم × {faNumber(karat)} عیار)
                </span>
                <span className="tabular-nums">{formatToman(base)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">اجرت ساخت اختصاصی (۱۵٪)</span>
                <span className="tabular-nums">{formatToman(fee)}</span>
              </div>
              {withChain && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">زنجیره (۲٫۵ گرم ۱۸ عیار)</span>
                  <span className="tabular-nums">{formatToman(chainCost)}</span>
                </div>
              )}
              <div className="gold-line my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">مبلغ سفارش</span>
                <span className="text-lg font-black tabular-nums gold-text">
                  {formatToman(total)}
                </span>
              </div>
              <p className="pt-1 text-[9px] text-muted-foreground/70">
                محاسبه با نرخ زندهٔ بازار — مبلغ نهایی پس از تأیید عیارسنجی قطعی می‌شود.
              </p>
            </div>
          </div>
        </motion.div>

        {/* فرم طراحی */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          className="space-y-6"
        >
          {/* متن */}
          <div className="glass rounded-3xl p-5">
            <Label className="text-sm font-black">۱. متن پلاک</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={30}
              placeholder="مثلاً: عشقِ من، مامانِ مهربان"
              className="mt-3 h-12 border-border/70 bg-black/25 text-base focus-visible:ring-gold/50"
            />
            <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground/70">
              <span>پیشنهاد: حداکثر ۱۲ حرف برای خوانایی بهتر حکاکی</span>
              <span className="tabular-nums">{faNumber(text.length)}/۳۰</span>
            </div>
          </div>

          {/* خوشنویسی */}
          <div className="glass rounded-3xl p-5">
            <Label className="text-sm font-black">۲. سبک خوشنویسی</Label>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {CALLIGRAPHY.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCalligraphy(c.id)}
                  className={`rounded-2xl border px-3 py-3 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    calligraphy === c.id
                      ? "border-gold bg-gold/10"
                      : "border-border/70 hover:border-gold/40"
                  }`}
                >
                  <div className={`${c.cls} text-xl leading-8 ${calligraphy === c.id ? "text-gold" : ""}`}>
                    آرا
                  </div>
                  <div className="mt-1 text-[9px] text-muted-foreground">{c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* فرم و رنگ */}
          <div className="glass rounded-3xl p-5">
            <Label className="text-sm font-black">۳. فرم و رنگ طلا</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    shape === s.id
                      ? "border-gold bg-gold text-[oklch(0.15_0.02_80)]"
                      : "border-border/70 text-muted-foreground hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`group flex flex-col items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-1 ${
                    color === c.id ? "" : "opacity-70"
                  }`}
                  aria-label={c.label}
                >
                  <span
                    className={`size-9 rounded-full transition-all duration-300 ${
                      color === c.id ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${c.stops[0]}, ${c.stops[1]} 55%, ${c.stops[2]})`,
                    }}
                  />
                  <span className="text-[9px] text-muted-foreground">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* وزن و عیار */}
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-black">۴. وزن و عیار</Label>
              <span className="text-sm font-black tabular-nums text-gold">
                {faNumber(weight, 1)} گرم
              </span>
            </div>
            <Slider
              value={[weight]}
              onValueChange={(v) => setWeight(v[0])}
              min={2}
              max={30}
              step={0.5}
              className="mt-4"
              aria-label="وزن پلاک بر حسب گرم"
            />
            <div className="mt-1 flex justify-between text-[9px] text-muted-foreground/60">
              <span>۲ گرم</span>
              <span>۳۰ گرم</span>
            </div>
            <div className="mt-4 flex gap-2">
              {[18, 21].map((k) => (
                <button
                  key={k}
                  onClick={() => setKarat(k)}
                  className={`flex-1 rounded-2xl border py-2.5 text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    karat === k
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border/70 text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  عیار {faNumber(k)}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-black/20 px-4 py-3">
              <div>
                <div className="text-xs font-bold">زنجیرهٔ طلایی</div>
                <div className="mt-0.5 text-[9px] text-muted-foreground">
                  افزودهٔ ۲٫۵ گرم طلای ۱۸ عیار
                </div>
              </div>
              <Switch checked={withChain} onCheckedChange={setWithChain} aria-label="افزودن زنجیره" />
            </div>
          </div>

          {/* اطلاعات تماس */}
          <div className="glass rounded-3xl p-5">
            <Label className="text-sm font-black">۵. اطلاعات تماس</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام و نام خانوادگی"
                className="h-11 border-border/70 bg-black/25 focus-visible:ring-gold/50"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="0912 ··· ····"
                className="h-11 border-border/70 bg-black/25 text-left tabular-nums focus-visible:ring-gold/50"
              />
            </div>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="توضیحات (اختیاری) — مثلاً بسته‌بندی کادویی"
              className="mt-3 h-11 border-border/70 bg-black/25 text-xs focus-visible:ring-gold/50"
            />
            <Button
              onClick={submit}
              disabled={submitting}
              className="mt-4 h-12 w-full rounded-full text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface hover:opacity-90"
            >
              {submitting ? <Loader2 className="size-5 animate-spin" /> : null}
              ثبت سفارش پلاک — {formatToman(total)}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* دیالوگ موفقیت */}
      <Dialog open={!!success} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent className="border-border/60 bg-[oklch(0.14_0.004_80)] sm:max-w-md">
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-16 text-emerald-400" />
            <DialogHeader className="mt-4 space-y-2">
              <DialogTitle className="text-center text-xl font-black">
                سفارش پلاک شما ثبت شد!
              </DialogTitle>
              <DialogDescription className="text-center text-sm leading-7">
                نقشهٔ ساخت پلاک به استودیو ارسال شد. کارشناس آرا برای تأیید جزئیات با شما تماس می‌گیرد.
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto mt-4 w-fit rounded-2xl border border-gold/25 bg-gold/8 px-6 py-3">
              <span className="text-xs text-muted-foreground">کد پیگیری: </span>
              <span className="font-black tabular-nums text-gold" dir="ltr">
                {success?.orderCode}
              </span>
            </div>
            <p className="mt-3 text-sm">
              مبلغ برآوردی:{" "}
              <span className="font-black tabular-nums text-gold">
                {formatToman(success?.totalPrice ?? 0)}
              </span>
            </p>
            <Button
              onClick={() => setSuccess(null)}
              className="mt-6 rounded-full border border-gold/30 bg-gold/15 px-8 text-gold hover:bg-gold hover:text-[oklch(0.15_0.02_80)]"
            >
              بستن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
