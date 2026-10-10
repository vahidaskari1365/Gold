"use client"

// سبد خرید مینیمال — همان منطق قبلی با تم جدید
import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store"
import { usePrices } from "./prices-provider"
import { computeItemPrice } from "@/lib/gold-calc"
import { formatToman, faNumber } from "@/lib/format"
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Gem,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function CartSheet() {
  const { items, isOpen, close, setQty, remove, clear } = useCart()
  const { map } = usePrices()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ orderCode: string; total: number } | null>(null)

  const priced = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        unitPrice: computeItemPrice(i, map),
      })),
    [items, map]
  )
  const total = priced.reduce((s, i) => s + i.unitPrice * i.qty, 0)
  const totalWeight = items.reduce((s, i) => s + i.weight * i.qty, 0)

  const submitOrder = async () => {
    if (customerName.trim().length < 2) {
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
    if (address.trim().length < 10) {
      toast({ title: "آدرس دقیق پستی را وارد کنید", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone: normalized,
          address,
          note: note || undefined,
          items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "خطا در ثبت سفارش")
      setSuccess({ orderCode: data.orderCode, total: data.total })
      clear()
      toast({
        title: "سفارش شما با موفقیت ثبت شد ✨",
        description: `کد سفارش: ${data.orderCode}`,
      })
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

  const resetCheckout = () => {
    setSuccess(null)
    setCheckoutOpen(false)
    setCustomerName("")
    setPhone("")
    setAddress("")
    setNote("")
    close()
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(o) => (o ? undefined : close())}>
        <SheetContent
          side="left"
          className="flex w-full flex-col border-border/60 bg-[oklch(0.125_0.004_80/97%)] backdrop-blur-xl sm:max-w-md"
        >
          <SheetHeader className="border-b border-border/60 pb-3">
            <SheetTitle className="flex items-center gap-2 text-lg font-black">
              <ShoppingBag className="size-5 text-gold" />
              سبد خرید
              {items.length > 0 && (
                <span className="rounded-full bg-gold/12 px-2 py-0.5 text-[11px] font-bold tabular-nums text-gold">
                  {faNumber(items.length)} کالا
                </span>
              )}
            </SheetTitle>
            <SheetDescription className="text-xs">
              قیمت‌ها بر اساس نرخ زندهٔ بازار محاسبه می‌شوند.
            </SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <span className="grid size-16 place-items-center rounded-full border border-gold/20 bg-gold/5">
                <Gem className="size-7 text-gold/60" />
              </span>
              <p className="text-sm text-muted-foreground">سبد خرید شما خالی است.</p>
              <Button
                variant="outline"
                onClick={close}
                className="rounded-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
              >
                مشاهده محصولات
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {priced.map((i) => (
                  <div
                    key={i.productId}
                    className="flex gap-3 rounded-2xl border border-border/60 bg-card/50 p-3"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={i.image}
                        alt={i.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold leading-5">{i.name}</h4>
                        <button
                          type="button"
                          onClick={() => remove(i.productId)}
                          className="text-muted-foreground transition-colors hover:text-red-400"
                          aria-label={`حذف ${i.name} از سبد`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {faNumber(i.weight, 2)} گرم •{" "}
                        {i.karat === 900 ? "سکه ۹۰۰" : `${faNumber(i.karat)} عیار`}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5 rounded-full border border-border/70 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => setQty(i.productId, i.qty + 1)}
                            className="grid size-6 place-items-center rounded-full text-gold hover:bg-gold/15"
                            aria-label="افزایش تعداد"
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <span className="min-w-5 text-center text-xs font-black tabular-nums">
                            {faNumber(i.qty)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(i.productId, i.qty - 1)}
                            className="grid size-6 place-items-center rounded-full text-gold hover:bg-gold/15"
                            aria-label="کاهش تعداد"
                          >
                            <Minus className="size-3.5" />
                          </button>
                        </div>
                        <div className="text-left">
                          <div className="text-[9px] text-muted-foreground">قیمت واحد</div>
                          <div className="text-xs font-black tabular-nums gold-text">
                            {formatToman(i.unitPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 bg-[oklch(0.11_0.004_80/70%)] px-4 py-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>وزن کل (تقریبی)</span>
                  <span className="tabular-nums">{faNumber(totalWeight, 2)} گرم</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-bold">مبلغ کل</span>
                  <span className="text-xl font-black tabular-nums gold-text">
                    {formatToman(total)}
                  </span>
                </div>
                <Button
                  onClick={() => setCheckoutOpen(true)}
                  className="mt-3 h-11 w-full rounded-full text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface hover:opacity-90"
                >
                  تکمیل خرید و پرداخت
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* دیالوگ تسویه */}
      <Dialog open={checkoutOpen} onOpenChange={(o) => !o && setCheckoutOpen(false)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto border-border/60 bg-[oklch(0.14_0.004_80)] sm:max-w-lg">
          {success ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto size-16 text-emerald-400" />
              <DialogHeader className="mt-4 space-y-2">
                <DialogTitle className="text-center text-xl font-black">
                  سفارش شما ثبت شد!
                </DialogTitle>
                <DialogDescription className="text-center text-sm leading-7">
                  کارشناسان آرا برای تأیید و هماهنگی پرداخت و ارسال، با شما تماس می‌گیرند.
                </DialogDescription>
              </DialogHeader>
              <div className="mx-auto mt-4 w-fit rounded-2xl border border-gold/25 bg-gold/8 px-6 py-3">
                <span className="text-xs text-muted-foreground">کد سفارش: </span>
                <span className="font-black tabular-nums text-gold" dir="ltr">
                  {success.orderCode}
                </span>
              </div>
              <p className="mt-3 text-sm">
                مبلغ کل:{" "}
                <span className="font-black tabular-nums text-gold">
                  {formatToman(success.total)}
                </span>
              </p>
              <Button
                onClick={resetCheckout}
                className="mt-6 rounded-full border border-gold/30 bg-gold/15 px-8 text-gold hover:bg-gold hover:text-[oklch(0.15_0.02_80)]"
              >
                بستن
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-black">
                  <Gem className="size-5 text-gold" />
                  تکمیل اطلاعات خرید
                </DialogTitle>
                <DialogDescription>
                  مبلغ نهایی پس از تأیید کارشناس بر اساس نرخ لحظه‌ای محاسبه و اعلام می‌شود.
                </DialogDescription>
              </DialogHeader>
              <div className="gold-line" />
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="co-name" className="text-sm font-bold">
                      نام و نام خانوادگی
                    </Label>
                    <Input
                      id="co-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="h-10 border-border/70 bg-black/25 focus-visible:ring-gold/50"
                      placeholder="مثلاً: مریم احمدی"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="co-phone" className="text-sm font-bold">
                      شماره موبایل
                    </Label>
                    <Input
                      id="co-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      dir="ltr"
                      className="h-10 border-border/70 bg-black/25 text-left tabular-nums focus-visible:ring-gold/50"
                      placeholder="0912 ··· ····"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="co-address" className="text-sm font-bold">
                    آدرس پستی
                  </Label>
                  <Textarea
                    id="co-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="border-border/70 bg-black/25 text-sm focus-visible:ring-gold/50"
                    placeholder="استان، شهر، خیابان، پلاک و کد پستی"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="co-note" className="text-sm font-bold">
                    توضیحات <span className="text-muted-foreground">(اختیاری)</span>
                  </Label>
                  <Textarea
                    id="co-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="border-border/70 bg-black/25 text-sm focus-visible:ring-gold/50"
                    placeholder="مثلاً: بسته‌بندی کادویی طلایی لازم دارم."
                  />
                </div>

                <div className="rounded-2xl border border-gold/15 bg-gold/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {faNumber(items.length)} کالا
                    </span>
                    <span className="font-black tabular-nums gold-text">
                      {formatToman(total)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={submitOrder}
                  disabled={submitting || items.length === 0}
                  className="h-12 w-full rounded-full text-base font-black text-[oklch(0.15_0.02_80)] gold-surface hover:opacity-90"
                >
                  {submitting ? <Loader2 className="size-5 animate-spin" /> : null}
                  ثبت نهایی سفارش
                </Button>
                <p className="text-center text-[10px] leading-5 text-muted-foreground">
                  پرداخت امن از طریق درگاه بانکی پس از تماس کارشناس انجام می‌شود.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
