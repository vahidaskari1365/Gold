// ابزارهای فرمت‌دهی فارسی

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => faDigits[Number(d)]);
}

export function toEnDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** ۱۲۳۴۵۶۷ → ۱٬۲۳۴٬۵۶۷ */
export function faNumber(n: number, fractionDigits = 0): string {
  return n.toLocaleString("fa-IR", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  });
}

/** قیمت به تومان با رقم فارسی */
export function formatToman(n: number, fractionDigits = 0): string {
  return `${faNumber(Math.round(n), fractionDigits)} تومان`;
}

/** وزن گرم با رقم فارسی */
export function formatGram(n: number): string {
  return `${faNumber(n, 2)} گرم`;
}

export function formatPercent(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${faNumber(Math.abs(n), 2)}٪`;
}

/** تاریخ و ساعت فارسی */
export function faDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function faTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
