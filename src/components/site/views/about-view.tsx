"use client"

// درباره ما — داستان برند، آمار، ارزش‌ها، تماس
import Image from "next/image"
import { motion } from "framer-motion"
import { BadgeCheck, Scale, ShieldCheck, Phone, MapPin, Clock } from "lucide-react"
import { useView } from "@/lib/store"
import { useCountUp } from "../count-up"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function Stat({ value, suffix, label, i }: { value: number; suffix: string; label: string; i: number }) {
  const shown = useCountUp(value, 1400)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
      className="glass rounded-2xl p-5 text-center"
    >
      <div className="text-2xl font-black tabular-nums gold-text md:text-3xl">
        {shown.toLocaleString("fa-IR", { maximumFractionDigits: 0 })}
        <span className="text-lg">{suffix}</span>
      </div>
      <div className="mt-1.5 text-[10px] text-muted-foreground">{label}</div>
    </motion.div>
  )
}

const VALUES = [
  {
    icon: BadgeCheck,
    title: "اصالت تضمینی",
    desc: "همهٔ آثار با عیارسنجی رسمی و مهر گالری عرضه می‌شوند؛ اصالت، اصل قرارداد ماست.",
  },
  {
    icon: Scale,
    title: "شفافیت قیمت",
    desc: "قیمت هر اثر با فرمول باز (ارزش طلا + اجرت + سود + مالیات) و نرخ زندهٔ بازار محاسبه می‌شود.",
  },
  {
    icon: ShieldCheck,
    title: "معامله امن",
    desc: "از سفارش تا تحویل، بسته‌بندی بیمه‌شده و پشتیبانی اختصاصی در کنار شماست.",
  },
]

export function AboutView() {
  const setView = useView((s) => s.setView)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-10"
      >
        <div className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">OUR STORY</div>
        <h1 className="text-3xl font-black md:text-5xl">
          هنرِ طلا، <span className="gold-text">میراثِ ما</span>
        </h1>
        <div className="gold-line mt-6" />
      </motion.div>

      {/* داستان */}
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border border-border/60"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/atelier.jpg"
              alt="کارگاه طلاسازی آرا"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.004_80/60%)] to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="space-y-5 text-sm leading-8 text-muted-foreground"
        >
          <p>
            گالری <span className="font-black text-foreground">آرا</span> از دل کارگاهی
            کوچک در بازار قدیم تهران آغاز شد؛ جایی که سه نسل استادکار، طلای خام را به
            روایتی از زیبایی بدل کرده‌اند. امروز همین دست‌ها، همان وسواس و همان
            استاندارد را به دنیای آنلاین آورده‌اند.
          </p>
          <p>
            ما باور داریم خرید طلا باید به‌شفافیِ خودِ فلز نجیب باشد؛ به همین دلیل
            قیمت هر اثر را لحظه‌به‌لحظه با نرخ رسمی بازار محاسبه می‌کنیم و تفکیک کامل
            آن را پیش چشم شما می‌گذاریم.
          </p>
          <p>
            از یک حلقهٔ مینیمال تا سرویس کامل سلطنتی، از شمش سرمایه‌گذاری تا پلاکی با
            نام شما — هر اثرِ آرا، امضای دستِ انسان را دارد.
          </p>
        </motion.div>
      </div>

      {/* آمار */}
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat value={25} suffix="+" label="سال تجربهٔ طلاسازی" i={0} />
        <Stat value={12400} suffix="+" label="مشتری وفادار" i={1} />
        <Stat value={98} suffix="٪" label="رضایت خرید" i={2} />
        <Stat value={100} suffix="٪" label="تضمین اصالت" i={3} />
      </div>

      {/* ارزش‌ها */}
      <div className="mt-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 text-xl font-black md:text-2xl"
        >
          چرا آرا؟
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              className="glass group rounded-3xl p-6 transition-colors duration-300 hover:border-gold/30"
            >
              <span className="grid size-11 place-items-center rounded-2xl border border-gold/25 bg-gold/8 text-gold transition-transform duration-300 group-hover:scale-110">
                <v.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-black">{v.title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* تماس */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="glass mt-14 grid gap-6 rounded-3xl p-7 md:grid-cols-3 md:p-9"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/8 text-gold">
            <MapPin className="size-4" />
          </span>
          <div>
            <div className="text-xs font-black">نشانی</div>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              تهران، خیابان ولیعصر، نرسیده به پارک‌وی، گالری آرا، پلاک ۲۱۴۸
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/8 text-gold">
            <Phone className="size-4" />
          </span>
          <div>
            <div className="text-xs font-black">تلفن</div>
            <p className="mt-1 text-xs leading-6 text-muted-foreground" dir="ltr">
              ۰۲۱ - ۸۸ ۹۴ ۶۲ ۱۴
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/8 text-gold">
            <Clock className="size-4" />
          </span>
          <div>
            <div className="text-xs font-black">ساعات کاری</div>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              شنبه تا پنجشنبه — ۱۰ صبح تا ۹ شب
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 text-center">
        <button
          onClick={() => setView("collection")}
          className="h-12 rounded-full px-8 text-sm font-black text-[oklch(0.15_0.02_80)] gold-surface transition-transform duration-300 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          کاوش در کالکشن آرا
        </button>
      </div>
    </div>
  )
}
