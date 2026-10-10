"use client"

// شمارنده‌ی متحرک قیمت — حس لحظه‌ای بودن نرخ‌ها
import { useEffect, useRef, useState } from "react"
import { faNumber } from "@/lib/format"

export function useCountUp(value: number, duration = 800): number {
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)

  useEffect(() => {
    const from = displayRef.current
    if (from === value) return
    const start = performance.now()
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const v = from + (value - from) * eased
      displayRef.current = v
      setDisplay(v)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return display
}

type AnimatedPriceProps = {
  value: number
  className?: string
  flash?: boolean
  suffix?: string
  fractionDigits?: number
}

/** عدد متحرک با فلش سبز/قرمز روی تغییر */
export function AnimatedPrice({
  value,
  className = "",
  flash = false,
  suffix,
  fractionDigits = 0,
}: AnimatedPriceProps) {
  const display = useCountUp(value)
  const [dir, setDir] = useState<"up" | "down" | null>(null)
  const [prev, setPrev] = useState(value)

  // الگوی مجاز ری‌اکت: مقایسه در زمان رندر
  if (flash && prev !== value) {
    setPrev(value)
    setDir(value > prev ? "up" : "down")
  }

  useEffect(() => {
    if (!dir) return
    const t = setTimeout(() => setDir(null), 1200)
    return () => clearTimeout(t)
  }, [dir, value])

  const flashCls =
    dir === "up"
      ? "text-emerald-400"
      : dir === "down"
        ? "text-red-400"
        : ""

  return (
    <span
      className={`tabular-nums transition-colors duration-500 ${flashCls} ${className}`}
    >
      {faNumber(display, fractionDigits)}
      {suffix ? <span className="ms-1 text-[0.62em] opacity-70">{suffix}</span> : null}
    </span>
  )
}
