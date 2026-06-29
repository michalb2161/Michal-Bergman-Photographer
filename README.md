# מיכל ברגמן צלמת — פורטפוליו

מונורפו: **Angular 20** + **Node.js / Express / MongoDB**. האתר בעברית (RTL) עם **Angular Material**.

תמונות סטטיות מהפרויקט (`/images/...`) מוגשות דרך ה-API בנתיב **`/site-media`**. לאחר `npm run seed` הקטגוריות והגלריה במסד מתעדכנות מתיקיות `images/` (חמש קטגוריות: חוץ, סטודיו, מוצר, **מזון**, ניו בורן), נוספים **מוצרי דוגמה** ל־`/api/products`, ומקטעי דף הבית מתעדכנים.

**התאמה להוראות קורס (מסמך docx):** `provideHttpClient`, שירות עם **GET/POST/PATCH/DELETE**, מודל `Product`, ניווט עם **routerLink** / **routerLinkActive**, קישור **חזרה** (`Router.navigate`), נתיבים **`/list`**, **`/details/:id`**, **`/add-product`** (טופס עם **ngModel**), וגלריית צילומים בנתיב `/gallery`.

## מבנה תיקיות

```
project-angular/
├── frontend/                 # אפליקציית Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # שירותים, interceptors, guards, מודלים
│   │   │   ├── layout/     # מעטפת ראשית (Navbar + Footer + outlet)
│   │   │   ├── features/   # דפים (home, gallery, admin, …)
│   │   │   └── shared/     # קומפוננטות משותפות (Hero, Masonry, …)
│   │   ├── environments/
│   │   └── styles.scss
│   └── angular.json
├── backend/                  # API
│   ├── src/
│   │   ├── config/         # חיבור MongoDB
│   │   ├── controllers/
│   │   ├── middleware/     # auth, upload, errors
│   │   ├── models/         # Mongoose
│   │   ├── routes/
│   │   ├── services/       # אימייל, עיבוד תמונה
│   │   ├── scripts/seed.js
│   │   └── server.js
│   ├── uploads/            # נוצר אוטומטית (תמונות מעובדות)
│   └── .env.example
└── README.md
```

## דרישות מקדימות

- Node.js 18+
- MongoDB פעיל מקומית או URI בענן

## Backend

1. העתקת משתני סביבה:

```powershell
cd backend
copy .env.example .env
```

ערוך `.env` — לפחות `MONGODB_URI` ו-`JWT_SECRET`.

2. התקנה והרצה:

```powershell
npm install
npm run seed
npm run dev
```

ה-API יאזין ל־`http://localhost:4000` (ברירת מחדל). קבצים סטטיים: `/uploads/...`.

**אימות מנהל:** לאחר `seed`, התחבר עם `ADMIN_EMAIL` / `ADMIN_PASSWORD` מה־`.env`.

## Frontend

```powershell
cd frontend
npm install
npm start
```

האתר: `http://localhost:4200` (RTL). כתובת ה-API מוגדרת ב־`src/environments/environment.ts` (`apiUrl`, `apiOrigin`).

בנייה לפרודקשן:

```powershell
npx ng build
```

## MongoDB

- מקומי: `mongodb://127.0.0.1:27017/studio_lux_portfolio`
- Atlas: החלף ב־`MONGODB_URI` ב־`.env`

`npm run seed` יוצר מנהל (אם חסר), **מוחק ומייצר מחדש קטגוריות ותמונות** מתיקיית `images/` (חמש קטגוריות), **מוצרי דוגמה**, מעדכן מקטעי דף בית, ומנקה המלצות ובלוג.

## אימייל (טופס יצירת קשר)

הגדר ב־`.env` את `SMTP_*` ו-`MAIL_TO`. אם לא מוגדר, ההודעה נשמרת בבסיס הנתונים בלבד.

## פריסה (המלצות קצרות)

1. **MongoDB** — Atlas או שרת מנוהל.
2. **Backend** — שרת Node (PM2, Docker, Railway, Render וכו'), הגדר `NODE_ENV=production`, `CORS_ORIGIN` לדומיין האתר, `JWT_SECRET` חזק.
3. **קבצים** — ודא שתיקיית `uploads` נשמרת בנפח קבוע (לא רק בתוך הקונטיינר ללא volume).
4. **Frontend** — בנה עם `environment.production.ts` (עדכן `apiUrl` ו-`apiOrigin`), שרת את `dist/frontend/browser` דרך CDN או nginx.

---

נבנה בסגנון מינימליסטי יוקרתי: בז׳, קרם ושחור רך, טיפוגרפיה קולנועית, אנימציות עדינות בגלילה, גלריה עם masonry ומודאל מסך מלא, ופאנל ניהול מלא.
