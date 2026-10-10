"use client"

// گالری آرا — تک‌مسیر با صفحات مجازی سینمایی
import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PricesProvider } from "@/components/site/prices-provider"
import { AmbientBackground } from "@/components/site/ambient-background"
import { CinematicLoader } from "@/components/site/cinematic-loader"
import { PriceTicker } from "@/components/site/price-ticker"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { CartSheet } from "@/components/site/cart-sheet"
import { useView } from "@/lib/store"
import { HomeView } from "@/components/site/views/home-view"
import { CollectionView } from "@/components/site/views/collection-view"
import { PlaqueView } from "@/components/site/views/plaque-view"
import { TradeView } from "@/components/site/views/trade-view"
import { AboutView } from "@/components/site/views/about-view"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Page() {
  const view = useView((s) => s.view)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [view])

  return (
    <PricesProvider>
      <AmbientBackground />
      <CinematicLoader />
      <div className="flex min-h-screen flex-col">
        <PriceTicker />
        <SiteHeader />
        <main className="flex-1 pt-24 md:pt-[108px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {view === "home" && <HomeView />}
              {view === "collection" && <CollectionView />}
              {view === "plaque" && <PlaqueView />}
              {view === "trade" && <TradeView />}
              {view === "about" && <AboutView />}
            </motion.div>
          </AnimatePresence>
        </main>
        <SiteFooter />
      </div>
      <CartSheet />
    </PricesProvider>
  )
}
