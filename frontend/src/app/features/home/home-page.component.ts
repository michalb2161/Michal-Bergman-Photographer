import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from '../../shared/components/hero-section/hero-section.component';
import { CategoryCardsComponent } from '../../shared/components/category-cards/category-cards.component';
import { CtaSectionComponent } from '../../shared/components/cta-section/cta-section.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { SeoService } from '../../core/services/seo.service';
import { Category, HomepageSection, ImageAsset } from '../../core/models/portfolio.models';
import { MatButtonModule } from '@angular/material/button';
import { ImageLightboxDialogComponent } from '../../shared/components/image-lightbox/image-lightbox-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { defaultHeroBackgroundUrl } from '../../core/utils/hero-background';
import { ImageLikeService } from '../../core/services/image-like.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HeroSectionComponent,
    CategoryCardsComponent,
    CtaSectionComponent,
    FadeInDirective,
    MatButtonModule
  ],
  template: `
    <app-hero-section
      [title]="heroTitle()"
      [subtitle]="heroSubtitle()"
      [imageUrl]="heroImage()"
      [primaryLink]="heroCtaHref()"
      [primaryLabel]="heroCtaLabel()"
    />

    <section class="lux-section" appFadeIn>
      <div class="lux-container">
        <div class="section-head">
          <h2>נבחרים מהגלריה</h2>
          <p class="muted">מבחר צילומים נבחרים מהגלריה.</p>
        </div>
        <div class="featured-grid">
          @for (img of featured(); track img._id) {
            <div class="shot" role="button" tabindex="0" (click)="open(img)" (keydown.enter)="open(img)" (keydown.space)="open(img)">
              <img [src]="api.absoluteMedia(img.thumbUrl || img.url)" [alt]="img.alt || ''" loading="lazy" />
              <button
                type="button"
                class="like"
                [class.liked]="likes.isLiked(img._id)"
                (click)="toggleLike($event, img)"
                [attr.aria-label]="likes.isLiked(img._id) ? 'ביטול לייק' : 'הוספת לייק'"
              >
                {{ likes.isLiked(img._id) ? '♥' : '♡' }}
              </button>
            </div>
          }
        </div>
        <div class="center">
          <a mat-stroked-button routerLink="/gallery">לגלריה המלאה</a>
        </div>
      </div>
    </section>

    <section class="lux-section" appFadeIn>
      <div class="lux-container">
        <div class="section-head">
          <h2>קטגוריות</h2>
          <p class="muted">צילומי חוץ, סטודיו, מוצר, מזון וניו בורן.</p>
        </div>
        <app-category-cards [categories]="categories()" />
      </div>
    </section>

    <app-cta-section
      title="נתאם שיחה קצרה?"
      subtitle="נספר לכם על התהליך, נבנה יחד לוח זמנים נינוח, ונדייק את הסגנון."
      primaryLabel="מילוי טופס"
      primaryLink="/contact"
    />
  `,
  styles: `
    .section-head {
      margin-bottom: 1.4rem;
    }
    h2 {
      margin: 0 0 0.35rem;
      font-size: clamp(1.8rem, 3vw, 2.6rem);
    }
    .muted {
      margin: 0;
      color: var(--lux-muted);
      line-height: 1.7;
    }
    .featured-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.55rem;
    }
    @media (max-width: 960px) {
      .featured-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .shot {
      border: none;
      padding: 0;
      border-radius: var(--lux-radius-sm);
      overflow: hidden;
      cursor: zoom-in;
      aspect-ratio: 1;
      background: var(--lux-surface-mid);
      position: relative;
    }
    .shot img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s ease;
    }
    .shot:hover img {
      transform: scale(1.06);
    }
    .like {
      position: absolute;
      inset-inline-end: 0.45rem;
      bottom: 0.45rem;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: #111;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: inherit;
      font-size: 1.7rem;
      font-weight: 600;
      line-height: 1;
      width: 2rem;
      height: 2rem;
      padding: 0;
      text-shadow: 0 1px 4px rgba(255, 255, 255, 0.75);
      z-index: 3;
    }
    .like.liked {
      color: #111;
    }
    .center {
      display: flex;
      justify-content: center;
      margin-top: 1.2rem;
    }
  `
})
export class HomePageComponent implements OnInit {
  readonly api = inject(PortfolioApiService);
  readonly likes = inject(ImageLikeService);
  private readonly seo = inject(SeoService);
  private readonly dialog = inject(MatDialog);

  readonly categories = signal<Category[]>([]);
  readonly featured = signal<ImageAsset[]>([]);

  readonly heroTitle = signal('מיכל ברגמן צלמת');
  readonly heroSubtitle = signal('צילומי חוץ, סטודיו, מוצר, מזון וניו בורן — בסגנון נקי, רך ומדויק.');
  readonly heroImage = signal(defaultHeroBackgroundUrl());
  readonly heroCtaLabel = signal('גלריה');
  readonly heroCtaHref = signal('/gallery');

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | בית`,
      description: 'מיכל ברגמן צלמת — צילומי חוץ, סטודיו, מוצר, מזון וניו בורן.'
    });

    this.api.getCategories().subscribe((res) => this.categories.set(res.data || []));
    this.api.getImages({ page: 1, limit: 40, featured: true }).subscribe((res) => {
      this.featured.set(res.data || []);
    });
    this.api.getHomepageSections().subscribe((res) => {
      const sections = res.data || [];
      const hero = sections.find((s: HomepageSection) => s.sectionKey === 'hero');
      if (hero?.title) this.heroTitle.set(hero.title);
      if (hero?.subtitle) this.heroSubtitle.set(hero.subtitle);
      if (hero?.imageUrl) this.heroImage.set(this.api.absoluteMedia(hero.imageUrl));
      if (hero?.ctaLabel) this.heroCtaLabel.set(hero.ctaLabel);
      if (hero?.ctaHref) this.heroCtaHref.set(hero.ctaHref);
    });
  }

  open(img: ImageAsset) {
    this.dialog.open(ImageLightboxDialogComponent, { data: { image: img }, maxWidth: '96vw' });
  }

  toggleLike(event: MouseEvent, img: ImageAsset) {
    event.stopPropagation();
    this.likes.toggle(img._id).subscribe({
      next: (res) => {
        img.likeCount = res.data.likeCount;
      }
    });
  }
}
