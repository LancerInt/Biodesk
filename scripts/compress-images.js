/**
 * Batch-compress product images for mobile performance.
 *
 * Hero images  → max 600px wide  (displayed at 160–180px, 3× density = 540px)
 * MOA  images  → max 1200px wide (displayed at ~400px, 3× density = 1200px)
 * Family icons → max 400px wide
 *
 * Run:  node scripts/compress-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'src', 'assets', 'images');

const CONFIGS = [
  {
    dir: path.join(ASSETS, 'ProductHero'),
    maxWidth: 600,
    label: 'Hero',
  },
  {
    dir: path.join(ASSETS, 'ProductMOA'),
    maxWidth: 1200,
    label: 'MOA',
  },
  {
    dir: path.join(ASSETS, 'Products'),
    maxWidth: 400,
    label: 'Family',
  },
];

async function compressImage(filePath, maxWidth, label) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const originalBuf = fs.readFileSync(filePath);
  const originalSize = originalBuf.length;
  const meta = await sharp(originalBuf).metadata();

  // Skip tiny placeholder files
  if (originalSize < 200) {
    console.log(`  SKIP ${path.basename(filePath)} (placeholder ${originalSize}B)`);
    return null;
  }

  let pipeline = sharp(originalBuf);

  // Resize if wider than max
  if (meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  // Compress as PNG (keep transparency for hero images)
  let output;
  if (ext === '.png') {
    output = await pipeline.png({ quality: 80, compressionLevel: 9, effort: 10 }).toBuffer();
  } else {
    output = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  }

  const savedPct = ((1 - output.length / originalSize) * 100).toFixed(1);
  const oldKB = (originalSize / 1024).toFixed(0);
  const newKB = (output.length / 1024).toFixed(0);

  // Only write if we actually saved space
  if (output.length < originalSize) {
    fs.writeFileSync(filePath, output);
    console.log(`  OK ${label} ${path.basename(filePath)}: ${meta.width}x${meta.height} → ${oldKB}KB → ${newKB}KB (${savedPct}% saved)`);
    return { saved: originalSize - output.length, file: path.basename(filePath) };
  } else {
    console.log(`  KEEP ${path.basename(filePath)}: already optimal (${oldKB}KB)`);
    return null;
  }
}

async function main() {
  let totalSaved = 0;
  let filesProcessed = 0;

  for (const config of CONFIGS) {
    if (!fs.existsSync(config.dir)) {
      console.log(`\nSkipping ${config.label}: directory not found`);
      continue;
    }

    const files = fs.readdirSync(config.dir).filter(f =>
      ['.png', '.jpg', '.jpeg'].includes(path.extname(f).toLowerCase())
    );

    console.log(`\n=== ${config.label} (${files.length} files, max ${config.maxWidth}px) ===`);

    for (const file of files) {
      const result = await compressImage(
        path.join(config.dir, file),
        config.maxWidth,
        config.label
      );
      if (result) {
        totalSaved += result.saved;
        filesProcessed++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Compressed ${filesProcessed} files`);
  console.log(`Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  console.log(`========================================`);
}

main().catch(console.error);
