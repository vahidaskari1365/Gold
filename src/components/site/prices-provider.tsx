"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import type { LivePrice } from "@/lib/gold-calc"
import { priceMap } from "@/lib/gold-calc"

type PricesCtx = {
  prices: LivePrice[]
  map: Record<string, LivePrice>
  updatedAt: string | null
  loading: boolean
  refresh: () => void
}

const Ctx = createContext<PricesCtx>({
  prices: [],
  map: {},
  updatedAt: null,
  loading: true,
  refresh: () => {},
})

export function usePrices() {
  return useContext(Ctx)
}

export function PricesProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<LivePrice[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/gold-price", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      if (!mounted.current) return
      if (Array.isArray(data.prices)) {
        setPrices(data.prices)
        setUpdatedAt(data.updatedAt ?? null)
      }
    } catch {
      // بی‌صدا رد شو — تیکر با داده قبلی می‌ماند
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    fetchPrices()
    const t = setInterval(fetchPrices, 15_000)
    return () => {
      mounted.current = false
      clearInterval(t)
    }
  }, [fetchPrices])

  return (
    <Ctx.Provider
      value={{
        prices,
        map: priceMap(prices),
        updatedAt,
        loading,
        refresh: fetchPrices,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
