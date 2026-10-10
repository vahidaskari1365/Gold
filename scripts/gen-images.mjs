import ZAI from 'z-ai-web-dev-sdk'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const OUT = '/home/z/my-project/public/images'
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const jobs = [
  {
    file: 'hero.jpg',
    size: '1440x736',
    prompt:
      'Luxurious elegant gold jewelry advertisement hero background: exquisite 18k yellow gold necklace with delicate ornate pendant draped over dark black silk fabric, dramatic cinematic studio lighting, golden bokeh particles floating in air, deep black background with warm golden glow, ultra premium jewelry store aesthetic, photorealistic, high quality, detailed',
  },
  {
    file: 'ring.jpg',
    size: '1024x1024',
    prompt:
      'Professional macro product photography of a luxurious 18k yellow gold ring with one brilliant-cut diamond, standing upright on glossy black reflective surface, dark charcoal background, warm golden rim lighting, premium jewelry catalog style, ultra sharp detail, high quality',
  },
  {
    file: 'ring2.jpg',
    size: '1024x1024',
    prompt:
      'Professional macro product photography of an elegant 18k yellow gold ring with deep blue sapphire gemstone surrounded by tiny diamonds, on black velvet, dark luxury background with soft golden light, premium jewelry catalog style, ultra sharp, high quality',
  },
  {
    file: 'necklace.jpg',
    size: '1024x1024',
    prompt:
      'Elegant 18k yellow gold necklace with polished heart pendant on fine venetian chain, displayed on black velvet jewelry bust, dark premium background, warm golden studio lighting, luxury jewelry photography, high quality, detailed',
  },
  {
    file: 'bracelet.jpg',
    size: '1024x1024',
    prompt:
      'Luxury 18k yellow gold bracelet with intricate herringbone weave pattern, curled elegantly on black glossy reflective surface, dark background, dramatic golden studio lighting, premium jewelry catalog photography, sharp macro detail, high quality',
  },
  {
    file: 'earrings.jpg',
    size: '1024x1024',
    prompt:
      'Pair of elegant 18k yellow gold drop earrings with mirror polish, standing on black velvet display, dark luxury background with warm golden bokeh, premium jewelry photography, macro sharp detail, high quality',
  },
  {
    file: 'set.jpg',
    size: '1024x1024',
    prompt:
      'Complete luxury 18k gold jewelry parure set: necklace, earrings, bracelet and ring with sparkling white stones, displayed together on dark black velvet, royal arrangement, dramatic golden studio lighting, dark premium background, high quality, detailed',
  },
  {
    file: 'set2.jpg',
    size: '1024x1024',
    prompt:
      'Luxury 18k gold jewelry set with embossed floral arabesque design: necklace and matching earrings, displayed on dark green-black velvet, warm golden lighting, premium oriental jewelry photography, high quality, detailed',
  },
  {
    file: 'coin1.jpg',
    size: '1024x1024',
    prompt:
      'Premium round gold bullion coin with ornate Persian floral engraving pattern and elegant arabesque border, lying on black velvet cloth, studio product photography, dark background, dramatic golden lighting, high quality, detailed',
  },
  {
    file: 'coin2.jpg',
    size: '1024x1024',
    prompt:
      'Shiny round gold bullion coin with radiant sun emblem engraving and decorative ornate rim, standing at slight angle on dark reflective black surface, luxury investment photography, golden dramatic lighting, high quality',
  },
  {
    file: 'bar.jpg',
    size: '1024x1024',
    prompt:
      'Stack of shiny 24k gold bullion bars with engraved weight markings, arranged on dark reflective black surface, dramatic warm golden side lighting, deep black background, luxury investment photography, photorealistic, high quality',
  },
  {
    file: 'melted.jpg',
    size: '1024x1024',
    prompt:
      'Molten liquid gold being poured from a crucible into a mold, glowing orange-gold liquid metal stream with reflections, dark industrial foundry background, sparks and heat glow, dramatic cinematic lighting, photorealistic, high quality',
  },
  {
    file: 'plaque.jpg',
    size: '1024x1024',
    prompt:
      'Elegant rectangular gold pendant plaque with ornate engraved ornamental border and blank polished mirror center, hanging on fine gold chain, displayed on dark black silk, luxury jewelry product photography, warm golden lighting, high quality, detailed',
  },
]

async function generateOne(zai, job, attempt = 1) {
  try {
    const res = await zai.images.generations.create({
      prompt: job.prompt,
      size: job.size,
    })
    const b64 = res?.data?.[0]?.base64
    if (!b64) throw new Error('empty base64')
    const buf = Buffer.from(b64, 'base64')
    const out = path.join(OUT, job.file)
    await sharp(buf).jpeg({ quality: 88 }).toFile(out)
    console.log(`✓ ${job.file} (${Math.round(buf.length / 1024)}KB)`)
  } catch (e) {
    if (attempt < 3) {
      console.log(`retry ${job.file} (attempt ${attempt}) — ${e.message}`)
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return generateOne(zai, job, attempt + 1)
    }
    console.error(`✗ FAILED ${job.file}: ${e.message}`)
  }
}

const zai = await ZAI.create()
for (const job of jobs) {
  const outPath = path.join(OUT, job.file)
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
    console.log(`skip ${job.file} (exists)`)
    continue
  }
  await generateOne(zai, job)
}
console.log('ALL DONE')
