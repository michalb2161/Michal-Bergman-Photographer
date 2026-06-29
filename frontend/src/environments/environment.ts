export const environment = {
  production: false,
  /**
   * בפיתוח: נתיבים יחסיים + `proxy.conf.json` מפנה ל־Express (פורט 4000).
   * חובה: `ng serve` + שרת backend רץ — אחרת אין API ואין תמונות מ־`/site-media`.
   */
  apiUrl: '/api',
  apiOrigin: '',
  siteName: 'מיכל ברגמן צלמת',
  logoUrl: '/logo.png',
  contactEmail: 'michalbphotography@gmail.com',
  /** נתיב יחסי מתחת ל-`images/` — רקע ה-Hero (אותו קובץ כמו ב-seed) */
  heroBackgroundPath: 'מיטה א.png'
};
