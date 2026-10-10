"use client"

// پس‌زمینه‌ی محیطی سینمایی: درخشش‌های محو + غبار طلایی شناور + وینیت
import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  tw: number
  ph: number
}

export function AmbientBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    let w = 0
    let h = 0
    let particles: Particle[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(70, Math.max(28, Math.floor((w * h) / 26000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.7,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.03 + Math.random() * 0.11),
        a: 0.1 + Math.random() * 0.28,
        tw: 0.4 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
      }))
    }

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -12) {
          p.y = h + 12
          p.x = Math.random() * w
        }
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12
        const alpha = p.a * (0.55 + 0.45 * Math.sin((t / 1000) * p.tw + p.ph))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(211, 176, 106, ${alpha.toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="glow-a absolute -top-1/4 left-1/4 size-[62vmax] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.06 80 / 15%) 0%, transparent 65%)",
        }}
      />
      <div
        className="glow-b absolute -bottom-1/3 right-0 size-[56vmax] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.45 0.05 70 / 13%) 0%, transparent 60%)",
        }}
      />
      <canvas ref={ref} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 52%, oklch(0.1 0.004 80 / 60%) 100%)",
        }}
      />
    </div>
  )
}
