const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

function getUploadRoot() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function processAndSaveImage(buffer) {
  const id = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const root = getUploadRoot();
  const imagesDir = path.join(root, 'images');
  const thumbsDir = path.join(root, 'thumbs');
  await ensureDir(imagesDir);
  await ensureDir(thumbsDir);

  const mainName = `${id}.webp`;
  const thumbName = `${id}-thumb.webp`;
  const mainPath = path.join(imagesDir, mainName);
  const thumbPath = path.join(thumbsDir, thumbName);

  const image = sharp(buffer).rotate();
  const metadata = await image.metadata();

  await image
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(mainPath);

  await sharp(buffer)
    .rotate()
    .resize({ width: 600, height: 600, fit: 'cover' })
    .webp({ quality: 78 })
    .toFile(thumbPath);

  const base = '/uploads';
  return {
    url: `${base}/images/${mainName}`,
    thumbUrl: `${base}/thumbs/${thumbName}`,
    width: metadata.width || 0,
    height: metadata.height || 0
  };
}

module.exports = { processAndSaveImage, getUploadRoot };
