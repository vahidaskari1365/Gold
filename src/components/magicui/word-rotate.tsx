"use client"

// Magic UI — WordRotate (اقتباس از github.com/magicuidesign/magicui)
// چرخش کلمات با انیمیشن — سازگار با جریان متن فارسی

import { useEffect, useState } from "react"
import { AnimatePresence, motion, type MotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -28 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 28 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)

    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <span
      className={cn(
        "inline-grid overflow-hidden align-bottom [grid-auto-columns:1fr]",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          className="col-start-1 row-start-1 inline-block"
          {...motionProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
