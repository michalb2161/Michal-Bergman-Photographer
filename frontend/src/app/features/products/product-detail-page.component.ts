import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/portfolio.models';
import { SeoService } from '../../core/services/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="lux-section">
      <div class="lux-container">
        @if (error()) {
          <p class="err">{{ error() }}</p>
          <a routerLink="/list">חזרה לרשימה</a>
        } @else if (item(); as p) {
          <a routerLink="/list" class="back">← רשימת מוצרים</a>
          <h1>{{ p.title }}</h1>
          @if (p.description) {
            <p class="desc">{{ p.description }}</p>
          }
          <p class="price">{{ p.price }} {{ p.currency || 'ILS' }}</p>
        }
      </div>
    </section>
  `,
  styles: `
    .back {
      display: inline-block;
      margin-bottom: 1rem;
      color: var(--lux-muted);
    }
    h1 {
      margin: 0 0 0.75rem;
    }
    .desc {
      line-height: 1.7;
      color: var(--lux-ink-soft);
    }
    .price {
      font-weight: 600;
      margin-top: 1rem;
    }
    .err {
      color: #b00020;
    }
  `
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductService);
  private readonly seo = inject(SeoService);

  readonly item = signal<Product | null>(null);
  readonly error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('חסר מזהה מוצר');
      return;
    }
    this.products.getProductById(id).subscribe({
      next: (p) => {
        this.item.set(p);
        this.seo.setPage({
          title: `${environment.siteName} | ${p.title}`,
          description: p.description || p.title
        });
      },
      error: () => this.error.set('המוצר לא נמצא.')
    });
  }
}
