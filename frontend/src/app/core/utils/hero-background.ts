import { environment } from '../../../environments/environment';

/** נתיב יחסי מתחת ל-`images/` (למשל `מיטה א.png` או `Studio shots/מיטה א.png`). */
export function defaultHeroBackgroundUrl(): string {
  const origin = environment.apiOrigin.replace(/\/$/, '');
  const rel = environment.heroBackgroundPath.replace(/\\/g, '/');
  const encoded = rel
    .split('/')
    .filter(Boolean)
    .map((seg: string) => encodeURIComponent(seg))
    .join('/');
  return `${origin}/site-media/${encoded}`;
}
