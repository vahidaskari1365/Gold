import type { Metadata } from "next";
import { Vazirmatn, Noto_Nastaliq_Urdu, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "آرا | گالری طلا و جواهر — قیمت لحظه‌ای بازار ایران",
  description:
    "آرا، گالری مینیمال طلا و جواهر — خرید و فروش آنلاین جواهر، سرویس، سکه، شمش و طلای آب‌شده با قیمت زنده و لحظه‌ای از بازار ایران. استودیوی طراحی پلاک اختصاصی با متن و وزن دلخواه شما.",
  keywords: [
    "طلا",
    "جواهر",
    "خرید طلا",
    "قیمت لحظه‌ای طلا",
    "سکه",
    "شمش",
    "طلای آب شده",
    "پلاک اختصاصی",
    "گالری طلا",
    "tgju",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazir.variable} ${nastaliq.variable} ${amiri.variable} font-vazir antialiased bg-background text-foreground noise`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
