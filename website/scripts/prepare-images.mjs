/**
 * Prepares site photography from the source images in ../assets.
 *
 * - Crops each photo to the composition the layout needs (and away from
 *   third-party branding visible in some event photos).
 * - Applies one consistent grade so photos from different venues read as a
 *   set: reduced saturation, slightly warm, softened blacks.
 * - Writes high-quality JPEG masters to src/assets/photos/. Astro then
 *   generates AVIF/WebP at the sizes each layout requests.
 *
 * Originals are never modified. Run with: npm run images
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(root, '../../assets/from-presentation');
const outDir = path.resolve(root, '../src/assets/photos');

/**
 * crop: region of the source in pixels (omit to keep the full frame).
 * Notes explain the crop so it can be revisited when originals arrive.
 */
const photos = [
  {
    out: 'hero.jpg',
    src: 'image10.jpeg',
    crop: { left: 330, top: 0, width: 819, height: 1024 },
    note: '4:5, centred on the smiling attendee',
  },
  {
    out: 'experience.jpg',
    src: 'image11.jpeg',
    crop: { left: 205, top: 0, width: 819, height: 1024 },
    note: '4:5, excludes the law-firm logo and trophies on the right wall',
  },
  {
    out: 'audience.jpg',
    src: 'image4.jpeg',
    crop: { left: 330, top: 0, width: 819, height: 1024 },
    note: '4:5, row of executives',
  },
  {
    out: 'gallery-01.jpg',
    src: 'image2.jpeg',
    crop: { left: 0, top: 110, width: 1500, height: 890 },
    note: 'handshake; top trimmed to remove the emergency-exit sign',
  },
  { out: 'gallery-02.jpg', src: 'image3.jpeg', note: 'full frame, U-shaped tables' },
  { out: 'gallery-03.jpg', src: 'image9.jpeg', note: 'full frame, corporate room' },
  {
    out: 'gallery-04.jpg',
    src: 'image12.jpeg',
    crop: { left: 0, top: 317, width: 1060, height: 707 },
    note: '3:2, excludes the projected sponsor logos on the right',
  },
  { out: 'gallery-05.jpg', src: 'image7.jpeg', note: 'full frame, portrait audience' },
];

const grade = (pipeline) =>
  pipeline
    .modulate({ saturation: 0.74 })
    // Per-channel lift: softens blacks and warms them very slightly.
    .linear([0.94, 0.94, 0.92], [10, 8, 6]);

await mkdir(outDir, { recursive: true });

for (const photo of photos) {
  const input = path.join(sourceDir, photo.src);
  let pipeline = sharp(input).rotate();
  if (photo.crop) pipeline = pipeline.extract(photo.crop);
  pipeline = grade(pipeline).jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' });

  const output = path.join(outDir, photo.out);
  const info = await pipeline.toFile(output);
  console.log(`${photo.out.padEnd(16)} ${info.width}×${info.height}  ${photo.note}`);
}
