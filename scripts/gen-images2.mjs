import ZAI from 'z-ai-web-dev-sdk'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const OUT = '/home/z/my-project/public/images'

const jobs = [
  {
    file: 'hero-cine.jpg',
    size: '1440x736',
    prompt:
      'Cinematic ultra-minimal luxury jewelry campaign photograph: a single exquisite 18k gold ring standing upright on a small polished black stone pedestal, vast deep black negative space around it, one dramatic warm golden spotlight beam from the upper corner, tiny floating gold dust particles catching the light, subtle atmospheric haze, extreme chiaroscuro contrast, premium commercial aesthetic like a luxury watch advertisement, photorealistic, 8k detail',
  },
  {
    file: 'atelier.jpg',
    size: '1024x1024',
    prompt:
      'Cinematic goldsmith atelier scene: artisan hands carefully polishing a glowing gold ring at a dark wooden workbench, warm amber torch light, deep moody shadows, fine gold dust floating in the light beam, shallow depth of field, luxury craftsmanship documentary photography, photorealistic, high detail',
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
    console.log(`OK ${job.file} (${Math.round(buf.length / 1024)}KB)`)
  } catch (e) {
    if (attempt < 3) {
      console.log(`retry ${job.file} (attempt ${attempt}) - ${e.message}`)
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return generateOne(zai, job, attempt + 1)
    }
    console.error(`FAILED ${job.file}: ${e.message}`)
  }
}

const zai = await ZAI.create()
for (const job of jobs) {
  await generateOne(zai, job)
}
console.log('ALL DONE')
