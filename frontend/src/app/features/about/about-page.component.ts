import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="lux-hero small">
      <div class="lux-container">
        <p class="eyebrow">אודות</p>
        <h1>מיכל ברגמן — צלמת עם עין שקטה</h1>
        <p class="lede">
          אני מצלמת רגעים אמיתיים — בלי תנוחות מאולצות, עם הקשבה למה שקורה ביניכם. כל פרויקט הוא שיתוף
          פעולה שקט ומדויק.
        </p>
      </div>
    </section>
    <section class="lux-section" appFadeIn>
      <div class="lux-container prose">
        <p>
          אני מתמחה בצילומי חוץ, צילומי סטודיו, צילום מוצר, צילומי מזון וצילומי ניו בורן. התהליך מתחיל בשיחה קצרה,
          ממשיך בליווי עדין ביום הצילום, ונשען על עריכת צבע רכה שמרגישה נשימה ולא “פילטר”.
        </p>
        <p>
          אני מאמינה שצילום טוב משאיר מקום לדמיון — לא חוסם אותו. לכן אני שומרת על קומפוזיציה נקייה,
          אור חם, וקצב עריכה שמרגיש כמו סרט עדין.
        </p>
      </div>
    </section>
  `,
  styles: `
    .lux-hero.small {
      padding: clamp(4rem, 10vw, 6rem) 0 1rem;
    }
    .eyebrow {
      letter-spacing: 0.28em;
      text-transform: uppercase;
      font-size: 0.72rem;
      color: var(--lux-muted);
      margin: 0 0 0.6rem;
    }
    h1 {
      margin: 0 0 0.8rem;
      font-size: clamp(2rem, 4vw, 3rem);
    }
    .lede {
      max-width: 720px;
      line-height: 1.9;
      color: var(--lux-muted);
      margin: 0;
    }
    .prose p {
      font-size: 1.05rem;
      line-height: 2;
      color: var(--lux-ink-soft);
    }
  `
})
export class AboutPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | אודות`,
      description: 'מיכל ברגמן צלמת — אודות ופילוסופיה.'
    });
  }
}
