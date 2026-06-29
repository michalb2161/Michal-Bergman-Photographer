import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { SeoService } from '../../core/services/seo.service';
import { Category, ImageAsset } from '../../core/models/portfolio.models';
import { ImageGalleryComponent } from '../../shared/components/image-gallery/image-gallery.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [MatButtonModule, ImageGalleryComponent, LoadingSpinnerComponent],
  template: `
    <section class="lux-section">
      <div class="lux-container head">
        <h1>גלריה</h1>
        <p class="muted">כל התמונות — ניתן לסנן לפי קטגוריה.</p>
        <div class="chips">
          <button mat-stroked-button (click)="selectCategory('')" [class.active]="!activeCategory()">
            הכל
          </button>
          @for (c of categories(); track c._id) {
            <button
              mat-stroked-button
              (click)="selectCategory(c._id)"
              [class.active]="activeCategory() === c._id"
            >
              {{ c.nameHe }}
            </button>
          }
        </div>
      </div>
      @if (loading()) {
        <app-loading-spinner />
      } @else {
        <div class="lux-container">
          <app-image-gallery [images]="items()" />
        </div>
      }
    </section>
  `,
  styles: `
    .head {
      margin-bottom: 1.2rem;
    }
    h1 {
      margin: 0 0 0.4rem;
    }
    .muted {
      margin: 0 0 1rem;
      color: var(--lux-muted);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `
})
export class GalleryPageComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories = signal<Category[]>([]);
  readonly items = signal<ImageAsset[]>([]);
  readonly loading = signal(true);
  readonly activeCategory = signal<string>('');

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | גלריה`,
      description: 'גלריית צילומים — חוץ, סטודיו, מוצר, מזון וניו בורן.'
    });
    this.api.getCategories().subscribe((res) => this.categories.set(res.data || []));
    this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('category') || '';
      this.activeCategory.set(cat);
      this.loadAll();
    });
  }

  selectCategory(id: string) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: id ? { category: id } : { category: null },
      queryParamsHandling: 'merge'
    });
  }

  loadAll() {
    this.loading.set(true);
    this.items.set([]);
    this.api
      .getImages({
        page: 1,
        limit: 400,
        category: this.activeCategory() || undefined
      })
      .subscribe({
        next: (res) => {
          this.items.set(res.data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
