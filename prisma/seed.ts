import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const goldPrices = [
  { symbol: 'gold_18', name: 'طلای ۱۸ عیار', unit: 'gram', basePrice: 7480000 },
  { symbol: 'gold_24', name: 'طلای ۲۴ عیار', unit: 'gram', basePrice: 9970000 },
  { symbol: 'mesghal', name: 'مثقال طلا', unit: 'mesghal', basePrice: 32390000 },
  { symbol: 'coin_emami', name: 'سکه امامی', unit: 'piece', basePrice: 82000000 },
  { symbol: 'coin_bahar', name: 'سکه بهار آزادی', unit: 'piece', basePrice: 78300000 },
  { symbol: 'coin_half', name: 'نیم‌سکه', unit: 'piece', basePrice: 42300000 },
  { symbol: 'coin_quarter', name: 'ربع‌سکه', unit: 'piece', basePrice: 26800000 },
  { symbol: 'coin_gram', name: 'سکه گرمی', unit: 'piece', basePrice: 13600000 },
  { symbol: 'bar', name: 'شمش ۲۴ عیار', unit: 'gram', basePrice: 10100000 },
  { symbol: 'melted', name: 'طلای آب‌شده', unit: 'gram', basePrice: 9780000 },
  { symbol: 'ounce', name: 'اونس جهانی (دلار)', unit: 'ounce', basePrice: 2712 },
]

type SeedProduct = {
  slug: string
  name: string
  category: string
  subCategory?: string
  description: string
  weight: number
  karat: number
  makingFee?: number
  profit?: number
  image: string
  stock?: number
  featured?: boolean
}

const products: SeedProduct[] = [
  // ---------- جواهرات ----------
  {
    slug: 'ring-royal-diamond',
    name: 'انگشتر رویال الماس‌نشان',
    category: 'jewelry',
    subCategory: 'انگشتر',
    description: 'انگشتر ۱۸ عیار با آبکاری الماسیوم و نگین‌های ظریف، طراحی سلطنتی ایتالیایی.',
    weight: 3.85,
    karat: 18,
    makingFee: 12,
    profit: 8,
    image: '/images/ring.jpg',
    stock: 5,
    featured: true,
  },
  {
    slug: 'ring-ruby-classic',
    name: 'انگشتر یاقوت کبود',
    category: 'jewelry',
    subCategory: 'انگشتر',
    description: 'انگشتر زنانه ۱۸ عیار با نگین یاقوت کبود اصل و رینگ‌های حصیری ظریف.',
    weight: 2.9,
    karat: 18,
    makingFee: 14,
    profit: 8,
    image: '/images/ring2.jpg',
    stock: 4,
  },
  {
    slug: 'necklace-heart-gold',
    name: 'گردنبند پلاک قلب ظریف',
    category: 'jewelry',
    subCategory: 'گردنبند',
    description: 'گردنبند ۱۸ عیار با پلاک قلب براق و زنجیره ونیزی، انتخابی همیشگی برای هدیه.',
    weight: 4.2,
    karat: 18,
    makingFee: 10,
    profit: 8,
    image: '/images/necklace.jpg',
    stock: 8,
    featured: true,
  },
  {
    slug: 'bracelet-italian',
    name: 'دستبند ایتالیایی بافت حصیری',
    category: 'jewelry',
    subCategory: 'دستبند',
    description: 'دستبند ۱۸ عیار با بافت حصیری درجه‌یک، سبک و درخشان با قفل مطمئن.',
    weight: 6.4,
    karat: 18,
    makingFee: 9,
    profit: 7,
    image: '/images/bracelet.jpg',
    stock: 6,
    featured: true,
  },
  {
    slug: 'earrings-shiny-drop',
    name: 'گوشواره میخی درخشان',
    category: 'jewelry',
    subCategory: 'گوشواره',
    description: 'گوشواره میخی ۱۸ عیار با پرداخت آینه‌ای، ظریف و سبک برای استفاده روزمره.',
    weight: 2.15,
    karat: 18,
    makingFee: 11,
    profit: 8,
    image: '/images/earrings.jpg',
    stock: 9,
  },
  {
    slug: 'ring-minimal-band',
    name: 'حلقه ساده تراش پلاتینی',
    category: 'jewelry',
    subCategory: 'انگشتر',
    description: 'حلقه ۱۸ عیار با تراش پلاتینی و پرداخت مات‌براق، مناسب ست کردن و هدیه.',
    weight: 3.3,
    karat: 18,
    makingFee: 8,
    profit: 7,
    image: '/images/ring.jpg',
    stock: 7,
  },
  // ---------- سرویس ----------
  {
    slug: 'set-royal-complete',
    name: 'سرویس کامل سلطنتی',
    category: 'set',
    subCategory: 'سرویس کامل',
    description: 'سرویس کامل ۱۸ عیار شامل گردنبند، دستبند، انگشتر و گوشواره با نگین‌های تراش‌خورده.',
    weight: 28.6,
    karat: 18,
    makingFee: 15,
    profit: 8,
    image: '/images/set.jpg',
    stock: 2,
    featured: true,
  },
  {
    slug: 'set-golbahar',
    name: 'سرویس گل‌بهار دوخت',
    category: 'set',
    subCategory: 'سرویس دوخت',
    description: 'سرویس دوخت ۱۸ عیار با طرح گل‌های برجسته و آبکاری الماسیوم درخشان.',
    weight: 19.3,
    karat: 18,
    makingFee: 16,
    profit: 8,
    image: '/images/set2.jpg',
    stock: 3,
    featured: true,
  },
  {
    slug: 'set-aylin-necklace',
    name: 'سرویس گردنبند و گوشواره آیلین',
    category: 'set',
    subCategory: 'سرویس نیم‌ست',
    description: 'نیم‌ست گردنبند و گوشواره ۱۸ عیار با طراحی مینیمال و سنگ‌های سفید براق.',
    weight: 11.8,
    karat: 18,
    makingFee: 13,
    profit: 7,
    image: '/images/necklace.jpg',
    stock: 4,
  },
  // ---------- سکه ----------
  {
    slug: 'coin-emami',
    name: 'سکه تمام امامی',
    category: 'coin',
    subCategory: 'سکه تمام',
    description: 'سکه تمام بهار آزادی طرح امامی، اصالت تضمینی، عرضه در بسته‌بندی سلفون بانکی.',
    weight: 8.133,
    karat: 900,
    makingFee: 0,
    profit: 2,
    image: '/images/coin1.jpg',
    stock: 6,
    featured: true,
  },
  {
    slug: 'coin-bahar-new',
    name: 'سکه بهار آزادی طرح جدید',
    category: 'coin',
    subCategory: 'سکه تمام',
    description: 'سکه تمام بهار آزادی طرح جدید، بدون اجرت ساخت، مناسب سرمایه‌گذاری.',
    weight: 8.133,
    karat: 900,
    makingFee: 0,
    profit: 2,
    image: '/images/coin2.jpg',
    stock: 6,
  },
  {
    slug: 'coin-half',
    name: 'نیم‌سکه بهار آزادی',
    category: 'coin',
    subCategory: 'نیم‌سکه',
    description: 'نیم‌سکه بهار آزادی با وزن ۴.۰۶۶ گرم، عرضه در بسته‌بندی مقوایی.',
    weight: 4.066,
    karat: 900,
    makingFee: 0,
    profit: 3,
    image: '/images/coin2.jpg',
    stock: 10,
  },
  {
    slug: 'coin-quarter',
    name: 'ربع‌سکه بهار آزادی',
    category: 'coin',
    subCategory: 'ربع‌سکه',
    description: 'ربع‌سکه بهار آزادی وزن ۲.۰۳۳ گرم، گزینه محبوب برای هدیه مناسبتی.',
    weight: 2.033,
    karat: 900,
    makingFee: 0,
    profit: 3,
    image: '/images/coin1.jpg',
    stock: 12,
  },
  // ---------- شمش ----------
  {
    slug: 'bar-1g',
    name: 'شمش طلا ۱ گرمی',
    category: 'bar',
    subCategory: 'شمش زربان',
    description: 'شمش ۲۴ عیار (۹۹۹.۹) یک گرمی زربان با هولوگرام و شماره سریال معتبر.',
    weight: 1,
    karat: 24,
    makingFee: 0,
    profit: 4,
    image: '/images/bar.jpg',
    stock: 20,
  },
  {
    slug: 'bar-2.5g',
    name: 'شمش طلا ۲/۵ گرمی',
    category: 'bar',
    subCategory: 'شمش زربان',
    description: 'شمش ۲۴ عیار دو و نیم گرمی زربان، بسته‌بندی ضددغدغه با کارت اصالت.',
    weight: 2.5,
    karat: 24,
    makingFee: 0,
    profit: 4,
    image: '/images/bar.jpg',
    stock: 15,
  },
  {
    slug: 'bar-5g',
    name: 'شمش طلا ۵ گرمی',
    category: 'bar',
    subCategory: 'شمش زربان',
    description: 'شمش ۲۴ عیار پنج گرمی زربان، محبوب‌ترین وزن برای شروع سرمایه‌گذاری طلا.',
    weight: 5,
    karat: 24,
    makingFee: 0,
    profit: 4,
    image: '/images/bar.jpg',
    stock: 12,
    featured: true,
  },
  {
    slug: 'bar-10g',
    name: 'شمش طلا ۱۰ گرمی',
    category: 'bar',
    subCategory: 'شمش زربان',
    description: 'شمش ۲۴ عیار ده گرمی زربان با به‌روزترین قیمت لحظه‌ای بازار.',
    weight: 10,
    karat: 24,
    makingFee: 0,
    profit: 4,
    image: '/images/bar.jpg',
    stock: 8,
  },
  // ---------- طلای آب‌شده ----------
  {
    slug: 'melted-5g',
    name: 'طلای آب‌شده ۵ گرمی عیار ۲۴',
    category: 'melted',
    subCategory: 'آب‌شده',
    description: 'طلای آب‌شده عیار ۲۴ (۹۹۵+) با تأییدیه عیارسنجی، فروش بر اساس وزن خالص.',
    weight: 5,
    karat: 24,
    makingFee: 0,
    profit: 2,
    image: '/images/melted.jpg',
    stock: 14,
    featured: true,
  },
  {
    slug: 'melted-10g',
    name: 'طلای آب‌شده ۱۰ گرمی عیار ۲۴',
    category: 'melted',
    subCategory: 'آب‌شده',
    description: 'طلای آب‌شده ده گرمی با عیارسنجی رسمی و ارائه فاکتور رسمی خرید.',
    weight: 10,
    karat: 24,
    makingFee: 0,
    profit: 2,
    image: '/images/melted.jpg',
    stock: 9,
  },
  {
    slug: 'melted-25g',
    name: 'طلای آب‌شده ۲۵ گرمی عیار ۲۴',
    category: 'melted',
    subCategory: 'آب‌شده',
    description: 'طلای آب‌شده بیست و پنج گرمی، مناسب سرمایه‌گذاران حرفه‌ای با کمترین حباب.',
    weight: 25,
    karat: 24,
    makingFee: 0,
    profit: 1.5,
    image: '/images/melted.jpg',
    stock: 5,
  },
]

async function main() {
  console.log('Seeding gold prices...')
  for (const p of goldPrices) {
    await db.goldPrice.upsert({
      where: { symbol: p.symbol },
      update: {},
      create: {
        symbol: p.symbol,
        name: p.name,
        unit: p.unit,
        basePrice: p.basePrice,
        openPrice: p.basePrice,
        price: p.basePrice,
      },
    })
  }

  console.log('Seeding products...')
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        subCategory: p.subCategory ?? null,
        description: p.description,
        weight: p.weight,
        karat: p.karat,
        makingFee: p.makingFee ?? 7,
        profit: p.profit ?? 7,
        tax: 9,
        image: p.image,
        stock: p.stock ?? 10,
        featured: p.featured ?? false,
      },
    })
  }

  console.log('✅ Seed done:', {
    prices: await db.goldPrice.count(),
    products: await db.product.count(),
  })
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
