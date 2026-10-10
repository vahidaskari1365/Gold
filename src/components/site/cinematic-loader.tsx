"use client"

// اینترو سینمایی — پرده‌ی سیاه، خط طلایی، لوگو و محو شدن
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function CinematicLoader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem("ara-intro") === "1"
    } catch {
      seen = false
    }
    const t = setTimeout(
      () => {
        try {
          sessionStorage.setItem("ara-intro", "1")
        } catch {
          /* ignore */
        }
        setDone(true)
      },
      seen ? 700 : 2500
    )
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[oklch(0.09_0.004_80)]"
          exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setDone(true)}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="h-px w-40 origin-center bg-gradient-to-l from-transparent via-[oklch(0.8_0.11_85)] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.h1
              className="gold-text text-7xl font-black leading-none md:text-8xl"
              initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              آرا
            </motion.h1>
            <motion.p
              className="text-[11px] font-medium tracking-[0.55em] text-muted-foreground"
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.55em" }}
              transition={{ duration: 1, delay: 1.05, ease: "easeOut" }}
            >
              گالری طلا و جواهر
            </motion.p>
            <motion.div
              className="h-px w-24 origin-center bg-gradient-to-l from-transparent via-[oklch(0.8_0.11_85/60%)] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
