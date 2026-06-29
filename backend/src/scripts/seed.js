require('dotenv').config();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Image = require('../models/Image');
const HomepageSection = require('../models/HomepageSection');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');
const Product = require('../models/Product');
const { connectDatabase } = require('../config/db');

const projectRoot = path.join(__dirname, '..', '..', '..');
const imagesRoot = path.join(projectRoot, 'images');

const CATEGORY_DEFS = [
  {
    slug: 'outdoor',
    nameHe: 'צילומי חוץ',
    nameEn: 'Outdoor',
    folder: 'Outdoor shots',
    coverFile: 'IMG_4784.jpg',
    sortOrder: 1,
    description: 'טבע, אור יום ומרחב פתוח'
  },
  {
    slug: 'studio',
    nameHe: 'סטודיו',
    nameEn: 'Studio',
    folder: 'Studio shots',
    coverFile: 'IMG_6935.JPG',
    sortOrder: 2,
    description: 'שליטה מלאה באור ורקע'
  },
  {
    slug: 'product',
    nameHe: 'מוצר',
    nameEn: 'Product',
    folder: 'Product photography',
    coverFile: 'IMG_5872.jpg',
    sortOrder: 3,
    description: 'מוצר בבהירות וסגנון נקי'
  },
  {
    slug: 'food',
    nameHe: 'צילומי מזון',
    nameEn: 'Food',
    folder: 'Food photography',
    coverFile: 'IMG_9967.jpg',
    sortOrder: 4,
    description: 'צלחת, מרקם וצבע — במבט נקי'
  },
  {
    slug: 'newborn',
    nameHe: 'ניו בורן',
    nameEn: 'Newborn',
    folder: 'New Born',
    coverFile: 'Untitle3d-2.png',
    sortOrder: 5,
    description: 'רוך ושקט סביב התינוק'
  }
];

/** סדר תצוגה ב«נבחרים מהגלריה» — שם קובץ כפי שנשמר ב-URL (אחרי decode). */
const FEATURED_FILES_ORDER = [
  'IMG_9526.jpg',
  'IMG_9481.JPG',
  'IMG_4885.jpg',
  'IMG_4987.jpg',
  'IMG_4784.jpg',
  'IMG_5076.jpg',
  'IMG_9967.jpg',
  'Untitlסed-2.png',
  'כוכבים.png',
  'מיטה.jpg',
  'בלונים.jpg',
  'IMG_6321.JPG',
  'IMG_5873.jpg',
  'IMG_9211.jpg',
  'out.jpg',
  'IMG_6965.jpg'
];

function listImageFiles(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((d) => d.isFile() && /\.(jpe?g|png|webp)$/i.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function siteMediaUrl(folderName, fileName) {
  return `/site-media/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
}

const HERO_BG_FILE = 'מיטה א.png';

/** נתיב יחסי מתחת ל-`images/` → URL תחת `/site-media/...` */
function siteMediaFromImagesRel(relFromImagesRoot) {
  const rel = String(relFromImagesRoot).replace(/\\/g, '/');
  return `/site-media/${rel
    .split('/')
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join('/')}`;
}

function findHeroBackgroundUrl() {
  const atRoot = path.join(imagesRoot, HERO_BG_FILE);
  if (fs.existsSync(atRoot) && fs.statSync(atRoot).isFile()) {
    return siteMediaFromImagesRel(HERO_BG_FILE);
  }
  function walk(dir) {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const hit = walk(full);
        if (hit) return hit;
      } else if (e.name === HERO_BG_FILE) {
        return siteMediaFromImagesRel(path.relative(imagesRoot, full));
      }
    }
    return null;
  }
  const found = walk(imagesRoot);
  if (found) return found;
  const outdoor = listImageFiles(path.join(imagesRoot, 'Outdoor shots'));
  return pickCoverUrl('Outdoor shots', 'IMG_4784.jpg', outdoor);
}

function buildSections() {
  const heroImg = findHeroBackgroundUrl();
  return [
    {
      sectionKey: 'hero',
      title: 'מיכל ברגמן צלמת',
      subtitle: 'צילומי חוץ, סטודיו, מוצר, מזון וניו בורן',
      body: 'גלריה מעודכנת מתיקיות העבודה.',
      imageUrl: heroImg,
      ctaLabel: 'לגלריה',
      ctaHref: '/gallery',
      sortOrder: 1,
      visible: true
    }
  ];
}

function pickCoverUrl(folder, preferredFile, files) {
  if (preferredFile && files.includes(preferredFile)) {
    return siteMediaUrl(folder, preferredFile);
  }
  return files.length ? siteMediaUrl(folder, files[0]) : '';
}

function mediaBasename(url) {
  if (!url) return '';
  const last = url.split('/').pop() || '';
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

function normFile(s) {
  return String(s).normalize('NFC').toLowerCase();
}

async function applyFeaturedFlags() {
  const rankBy = new Map();
  FEATURED_FILES_ORDER.forEach((f, idx) => {
    rankBy.set(normFile(f), idx + 1);
  });
  const all = await Image.find({});
  for (const img of all) {
    const base = normFile(mediaBasename(img.url));
    const rank = rankBy.get(base);
    const featured = Boolean(rank);
    const sortOrder = featured ? rank : 0;
    if (img.featured !== featured || img.sortOrder !== sortOrder) {
      await Image.updateOne({ _id: img._id }, { $set: { featured, sortOrder } });
    }
  }
}

async function run() {
  await connectDatabase();
  const email = process.env.ADMIN_EMAIL || 'admin@studio.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await User.hashPassword(password);
    user = await User.create({
      name: 'מנהל',
      username: 'admin',
      email,
      passwordHash,
      role: 'admin'
    });
    // eslint-disable-next-line no-console
    console.log('Created admin:', email);
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin exists:', email);
  }

  await Category.deleteMany({});
  await Image.deleteMany({});
  // eslint-disable-next-line no-console
  console.log('Cleared categories & images');

  for (const def of CATEGORY_DEFS) {
    const folderPath = path.join(imagesRoot, def.folder);
    const files = listImageFiles(folderPath);
    const coverUrl = pickCoverUrl(def.folder, def.coverFile, files);

    const cat = await Category.create({
      nameHe: def.nameHe,
      nameEn: def.nameEn,
      slug: def.slug,
      description: def.description,
      coverImageUrl: coverUrl,
      sortOrder: def.sortOrder
    });

    for (const file of files) {
      const url = siteMediaUrl(def.folder, file);
      await Image.create({
        title: file.replace(/\.[^.]+$/, ''),
        alt: `${def.nameHe} — ${file}`,
        url,
        thumbUrl: url,
        category: cat._id,
        featured: false
      });
    }
    // eslint-disable-next-line no-console
    console.log(`Category ${def.slug}: ${files.length} images`);
  }

  await applyFeaturedFlags();
  // eslint-disable-next-line no-console
  console.log('Featured gallery flags applied');

  await HomepageSection.deleteMany({ sectionKey: 'about_teaser' });

  for (const s of buildSections()) {
    await HomepageSection.findOneAndUpdate(
      { sectionKey: s.sectionKey },
      { $set: { ...s } },
      { upsert: true, new: true }
    );
  }
  // eslint-disable-next-line no-console
  console.log('Homepage sections updated');

  await Testimonial.deleteMany({});
  // eslint-disable-next-line no-console
  console.log('Testimonials cleared');

  await BlogPost.deleteMany({});
  // eslint-disable-next-line no-console
  console.log('Blog posts cleared');

  await Product.deleteMany({});
  await Product.create([
    {
      title: 'חבילת צילום בסטודיו',
      description: 'שעה בסטודיו, עריכת בסיס וגלריה דיגיטלית.',
      price: 890,
      currency: 'ILS',
      imageUrl: '',
      slug: 'studio-package-basic',
      visible: true,
      sortOrder: 1
    },
    {
      title: 'צילום חוץ — סשן משפחתי',
      description: 'עד שעה וחצי, מיקום לבחירה באזור המרכז.',
      price: 1200,
      currency: 'ILS',
      imageUrl: '',
      slug: 'outdoor-family-session',
      visible: true,
      sortOrder: 2
    },
    {
      title: 'צילום מוצר — סט בסיסי',
      description: 'עד 5 מוצרים, רקע נקי, קבצים לרשת.',
      price: 650,
      currency: 'ILS',
      imageUrl: '',
      slug: 'product-set-basic',
      visible: true,
      sortOrder: 3
    }
  ]);
  // eslint-disable-next-line no-console
  console.log('Sample products created');

  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
