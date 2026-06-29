import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/portfolio.models';
import { SeoService } from '../../core/services/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="lux-section">
      <div class="lux-container">
        <h1>רשימת מוצרים</h1>
        <p class="muted">נתונים מהשרת (MongoDB) דרך HttpClient.</p>
        @if (error()) {
          <p class="err">{{ error() }}</p>
        } @else if (!items().length && loaded()) {
          <p class="muted">אין מוצרים להצגה. אפשר להוסיף ב־<a routerLink="/add-product">הוספת מוצר</a> (מנהל).</p>
        } @else {
          <ul class="list">
            @for (item of items(); track item._id) {
              <li>
                <a [routerLink]="['/details', item._id]">{{ item.title }}</a>
                @if (item.price != null) {
                  <span class="price">{{ item.price }} {{ item.currency || 'ILS' }}</span>
                }
              </li>
            }
          </ul>
        }
      </div>
    </section>
  `,
  styles: `
    h1 {
      margin: 0 0 0.5rem;
    }
    .muted {
      color: var(--lux-muted);
      margin: 0 0 1.2rem;
    }
    .err {
      color: #b00020;
    }
    .list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.65rem;
    }
    .list li {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--lux-line);
    }
    .list a {
      font-weight: 500;
      color: var(--lux-ink);
    }
    .price {
      color: var(--lux-muted);
      font-size: 0.95rem;
    }
  `
})
export class ProductListPageComponent implements OnInit {
  private readonly products = inject(ProductService);
  private readonly seo = inject(SeoService);

  readonly items = signal<Product[]>([]);
  readonly loaded = signal(false);
  readonly error = signal('');

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | רשימת מוצרים`,
      description: 'רשימת מוצרים / חבילות מהמסד.'
    });
    this.products.getAllProducts(true).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loaded.set(true);
      },
      error: () => {
        this.error.set('לא ניתן לטעון את הרשימה. ודאי שהשרת רץ.');
        this.loaded.set(true);
      }
    });
  }
}
