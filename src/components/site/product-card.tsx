"use client"

// کارت محصول مینیمال مدرن — تصویر سینمایی، قیمت زنده، افزودن به سبد
import Image from "next/image"
import { motion } from "framer-motion"
import { Plus, Check } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/store"
import { AnimatedPrice } from "./count-up"
import { formatToman, faNumber } from "@/lib/format"
import { toast } from "@/hooks/use-toast"

export type ProductCardData = {
  id: string
  slug: string
  name: string
  category: string
  subCategory?: string | null
  description: string
  weight: number
  karat: number
  makingFee?: number
  profit?: number
  tax?: number
  stock: number
  image: string
  price: number
}

const CATEGORY_FA: Record<string, string> = {
  jewelry: "جواهر",
  set: "سرویس",
  coin: "سکه",
  bar: "شمش",
  melted: "آب‌شده",
}

export function ProductCard({
  product,
  index = 0,
  onOpen,
  compact = false,
}: {
  product: ProductCardData
  index?: number
  onOpen?: (p: ProductCardData) => void
  compact?: boolean
}) {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState(false)

  const onAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        category: product.category,
        weight: product.weight,
        karat: product.karat,
        makingFee: product.makingFee ?? 0,
        profit: product.profit ?? 0,
        stock: Math.max(1, product.stock),
      },
      1
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
    toast({ title: "به سبد اضافه شد ✨", description: product.name })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/55 backdrop-blur-sm transition-all duration-500 hover:border-gold/35 hover:shadow-[0_18px_50px_-20px_oklch(0.8_0.11_85/25%)] ${
        compact ? "" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen?.(product)}
        className="relative block w-full overflow-hidden text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`جزئیات ${product.name}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.004_80/85%)] via-transparent to-transparent" />
          <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[9px] font-bold text-foreground/90 backdrop-blur-md">
            {CATEGORY_FA[product.category] ?? product.category}
          </span>
          {product.stock <= 3 && (
            <span className="absolute left-3 top-3 rounded-full bg-[oklch(0.62_0.19_25/85%)] px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-md">
              موجودی محدود
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[13px] font-bold leading-6">{product.name}</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {faNumber(product.weight, product.weight % 1 === 0 ? 0 : 2)} گرم
          {" · "}
          {product.karat === 900 ? "سکه ۹۰۰" : `${faNumber(product.karat)} عیار`}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[9px] text-muted-foreground/70">قیمت لحظه‌ای</div>
            <AnimatedPrice
              value={product.price}
              flash
              className="text-[13px] font-black text-gold"
            />
            <span className="ms-1 text-[8px] text-muted-foreground/60">تومان</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onAdd}
            className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              added
                ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-400"
                : "border-gold/40 text-gold hover:bg-gold hover:text-[oklch(0.15_0.02_80)]"
            }`}
            aria-label={`افزودن ${product.name} به سبد خرید`}
          >
            {added ? <Check className="size-4" /> : <Plus className="size-4" />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export { formatToman }
