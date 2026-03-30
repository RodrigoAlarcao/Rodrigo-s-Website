/**
 * Image optimization script — converts production hero images to WebP.
 * Run once: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "../public/images");

const conversions = [
  {
    input: "hero-bg8.jpg",
    output: "hero-bg8.webp",
    maxWidth: 1920,
    quality: 75,
    description: "Desktop hero background",
  },
  {
    input: "bg-mobile2.jpg",
    output: "bg-mobile2.webp",
    maxWidth: 828,
    quality: 75,
    description: "Mobile hero background",
  },
  {
    input: "hero-bg-front4.jpg",
    output: "hero-bg-front4.webp",
    maxWidth: 1920,
    quality: 78,
    description: "Canvas wireframe layer",
  },
];

for (const { input, output, maxWidth, quality, description } of conversions) {
  const inputPath = join(imagesDir, input);
  const outputPath = join(imagesDir, output);

  if (!existsSync(inputPath)) {
    console.error(`Missing: ${inputPath}`);
    continue;
  }

  const { size: beforeBytes } = (await import("fs")).statSync(inputPath);
  const beforeKB = Math.round(beforeBytes / 1024);

  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  const { size: afterBytes } = (await import("fs")).statSync(outputPath);
  const afterKB = Math.round(afterBytes / 1024);
  const saving = Math.round((1 - afterBytes / beforeBytes) * 100);

  console.log(
    `${description}: ${input} (${beforeKB}KB) → ${output} (${afterKB}KB) — ${saving}% smaller`
  );
}

console.log("\nDone. Update Hero.tsx to reference .webp files.");
