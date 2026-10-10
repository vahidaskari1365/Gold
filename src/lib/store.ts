"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  slug: string
  name: string
  image: string
  category: string
  weight: number
  karat: number
  makingFee: number
  profit: number
  stock: number
  qty: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, qty = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, qty: Math.min(i.qty + qty, item.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, qty }] })
        }
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId
                ? { ...i, qty: Math.min(qty, i.stock) }
                : i
            ),
          })
        }
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "zarrin-cart",
      partialize: (s) => ({ items: s.items }),
    }
  )
)

export type SiteView = "home" | "collection" | "plaque" | "trade" | "about"

type ViewState = {
  view: SiteView
  setView: (v: SiteView) => void
}

/** روتر مجازی صفحات — همه‌چیز در مسیر «/» اما صفحات مجزا و سینمایی */
export const useView = create<ViewState>((set) => ({
  view: "home",
  setView: (v) => set({ view: v }),
}))

type ShopUIState = {
  activeCategory: string // all | jewelry | set | coin | bar | melted
  setActiveCategory: (c: string) => void
}

export const useShopUI = create<ShopUIState>((set) => ({
  activeCategory: "all",
  setActiveCategory: (c) => set({ activeCategory: c }),
}))
