"use client"

// میز معامله — جدول نرخ زنده + ماشین‌حساب خرید/فروش
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, RefreshCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { usePrices } from "../prices-provider"
import { AnimatedPrice } from "../count-up"
import { BUY_MULT, SELL_MULT } from "@/lib/gold-calc"
import { formatToman, faNumber, formatPercent, faDateTime, toEnDigits } from "@/lib/format"
import { toast } from "@/hooks/use-toast"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Asset = "gold18" | "gold24" | "bar" | "melted" | "coin_emami"

const ASSETS: { id: Asset; label: string; symbol: string; unit: "gram" | "piece" }[] = [
  { id: "gold18", label: "طلای ۱۸ عیار", symbol: "gold_18", unit: "gram" },
  { id: "gold24", label: "طلای ۲۴ عیار", symbol: "gold_24", unit: "gram" },
  { id: "bar", label: "شمش ۲۴ عیار", symbol: "bar", unit: "gram" },
  { id: "melted", label: "طلای آب‌شده", symbol: "melted", unit: "gram" },
  { id: "coin_emami", label: "سکه امامی", symbol: "coin_emami", unit: "piece" },
]

const QUICK_GRAMS = [0.5, 1, 5, 10, 20, 50]
const QUICK_COINS = [1, 2, 5, 10]

export function TradeView() {
  const { map, updatedAt, refresh } = usePrices()
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [asset, setAsset] = useState<Asset>("gold18")
  const [weightStr, setWeightStr] = useState("1")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ code: string; amount: number } | null>(null)

  const assetConf = ASSETS.find((a) => a.id === asset)!
  const unitPrice = map[assetConf.symbol]?.price ?? 0
  const weight = Number(toEnDigits(weightStr)) || 0
  const mult = side === "buy" ? BUY_MULT : SELL_MULT
  const amount = useMemo(() => Math.round(unitPrice * weight * mult), [unitPrice, weight, mult])

  const isCoin = asset === "coin_emami"

  const submit = async () => {
    if (weight <= 0 || (isCoin && !Number.isInteger(weight))) {
      toast({
        title: isCoin ? "تعداد سکه معتبر نیست" : "وزن معتبر نیست",
        variant: "destructive",
      })
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
      const res = await fetch("/api/trade-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side, asset, weight, customerName: name, phone: normalized }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "خطا در ثبت درخواست")
      setSuccess({ code: data.code, amount: data.amount })
      toast({ title: "درخواست معامله ثبت شد ✨", description: `کد پیگیری: ${data.code}` })
    } catch (e) {
      toast({
        title: "خطا در ثبت درخواست",
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
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-gold">
          <span className="live-dot inline-block size-1.5 rounded-full bg-emerald-400" />
          TRADING DESK
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-black md:text-5xl">میزِ معامله طلا</h1>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            {updatedAt ? faDateTime(updatedAt) : ""}
            <button
              onClick={refresh}
              className="grid size-8 place-items-center rounded-full border border-border/70 transition-colors hover:border-gold/50 hover:text-gold outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="به‌روزرسانی نرخ‌ها"
            >
              <RefreshCcw className="size-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground">
          خرید و فروش شفاف طلا، شمش و سکه با نرخ زندهٔ tgju.org — کارمزد خرید ۰٫۵٪ و
          کارمزد فروش ۱٫۵٪. مبلغ نهایی پس از عیارسنجی حضوری قطعی می‌شود.
        </p>
        <div className="gold-line mt-6" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* جدول نرخ‌ها */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="glass overflow-hidden rounded-3xl"
        >
          <div className="grid grid-cols-4 border-b border-border/60 px-5 py-3.5 text-[10px] font-bold text-muted-foreground">
            <span>دارایی</span>
            <span className="text-center">
              فروش به شما <span className="block text-[8px] font-normal opacity-60">(×۱٫۰۰۵)</span>
            </span>
            <span className="text-center">
              خرید از شما <span className="block text-[8px] font-normal opacity-60">(×۰٫۹۸۵)</span>
            </span>
            <span className="text-center">تغییر</span>
          </div>
          <div className="divide-y divide-border/40">
            {ASSETS.map((a, i) => {
              const p = map[a.symbol]
              const up = (p?.changePercent ?? 0) >= 0
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE }}
                  className={`grid grid-cols-4 items-center px-5 py-3.5 text-xs transition-colors ${
                    asset === a.id ? "bg-gold/5" : ""
                  }`}
                >
                  <span className="font-bold">{a.label}</span>
                  <span className="text-center font-black tabular-nums text-gold">
                    {p ? formatToman(p.price * BUY_MULT) : "—"}
                  </span>
                  <span className="text-center font-black tabular-nums text-foreground/90">
                    {p ? formatToman(p.price * SELL_MULT) : "—"}
                  </span>
                  <span
                    className={`text-center text-[10px] font-bold tabular-nums ${
                      up ? "text-emerald-400" : "text-red-400"
                    }`}
                    dir="ltr"
                  >
                    {p ? `${up ? "▲" : "▼"} ${formatPercent(p.changePercent)}` : "—"}
                  </span>
                </motion.div>
              )
            })}
          </div>
          <div className="px-5 py-3 text-[9px] text-muted-foreground/70">
            نرخ‌ها هر ۳۰ ثانیه از <span dir="ltr">tgju.org</span> به‌روزرسانی می‌شود.
          </div>
        </motion.div>

        {/* ماشین‌حساب معامله */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
          className="glass rounded-3xl p-6"
        >
          {/* تب خرید/فروش */}
          <div className="grid grid-cols-2 gap-1 rounded-full border border-border/60 bg-black/25 p-1">
            {(
              [
                { id: "buy", label: "خرید از ما" },
                { id: "sell", label: "فروش به ما" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setSide(t.id)}
                className={`relative h-10 rounded-full text-xs font-black transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  side === t.id
                    ? "text-[oklch(0.15_0.02_80)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {side === t.id && (
                  <motion.span
                    layoutId="trade-tab"
                    className="absolute inset-0 rounded-full gold-surface"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>

          {/* انتخاب دارایی */}
          <div className="mt-5">
            <Label className="text-xs font-bold text-muted-foreground">دارایی</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ASSETS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAsset(a.id)
                    setWeightStr(a.unit === "piece" ? "1" : "1")
                  }}
                  className={`rounded-full border px-3.5 py-2 text-[11px] font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    asset === a.id
                      ? "border-gold bg-gold text-[oklch(0.15_0.02_80)]"
                      : "border-border/70 text-muted-foreground hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* وزن */}
          <div className="mt-5">
            <Label className="text-xs font-bold text-muted-foreground">
              {isCoin ? "تعداد (عدد)" : "وزن (گرم)"}
            </Label>
            <Input
              value={weightStr}
              onChange={(e) => setWeightStr(e.target.value.replace(/[^\d.۰-۹]/g, ""))}
              inputMode="decimal"
              dir="ltr"
              className="mt-2 h-12 border-border/70 bg-black/25 text-center text-lg font-black tabular-nums focus-visible:ring-gold/50"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(isCoin ? QUICK_COINS : QUICK_GRAMS).map((q) => (
                <button
                  key={q}
                  onClick={() => setWeightStr(String(q))}
                  className="rounded-full border border-border/60 px-3 py-1 text-[10px] tabular-nums text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {faNumber(q)}
                </button>
              ))}
            </div>
          </div>

          {/* مبلغ */}
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-5 text-center">
            <div className="text-[10px] text-muted-foreground">
              {side === "buy" ? "مبلغ پرداختی شما" : "مبلغ دریافتی شما"}
            </div>
            <AnimatedPrice
              value={amount}
              flash
              className="mt-1 block text-3xl font-black text-gold"
            />
            <div className="mt-1 text-[9px] text-muted-foreground/70">
              نرخ واحد: {unitPrice ? formatToman(unitPrice * mult) : "—"} از هر {isCoin ? "عدد" : "گرم"}
            </div>
          </div>

          {/* اطلاعات */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
          <Button
            onClick={submit}
            disabled={submitting || weight <= 0}
            className="mt-4 h-12 w-full rounded-full text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface hover:opacity-90"
          >
            {submitting ? <Loader2 className="size-5 animate-spin" /> : null}
            {side === "buy" ? "ثبت درخواست خرید" : "ثبت درخواست فروش"}
          </Button>
          <p className="mt-3 text-center text-[9px] leading-5 text-muted-foreground/70">
            پس از ثبت درخواست، کارشناس معاملات برای عیارسنجی و تسویه با شما تماس می‌گیرد.
          </p>
        </motion.div>
      </div>

      {/* موفقیت */}
      <Dialog open={!!success} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent className="border-border/60 bg-[oklch(0.14_0.004_80)] sm:max-w-md">
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-16 text-emerald-400" />
            <DialogHeader className="mt-4 space-y-2">
              <DialogTitle className="text-center text-xl font-black">
                درخواست شما ثبت شد
              </DialogTitle>
              <DialogDescription className="text-center text-sm leading-7">
                کارشناس معاملات آرا جهت هماهنگی تسویه و تحویل با شما تماس می‌گیرد.
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto mt-4 w-fit rounded-2xl border border-gold/25 bg-gold/8 px-6 py-3">
              <span className="text-xs text-muted-foreground">کد پیگیری: </span>
              <span className="font-black tabular-nums text-gold" dir="ltr">
                {success?.code}
              </span>
            </div>
            <p className="mt-3 text-sm">
              مبلغ برآوردی:{" "}
              <span className="font-black tabular-nums text-gold">
                {formatToman(success?.amount ?? 0)}
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
