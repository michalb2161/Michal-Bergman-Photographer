import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { environment } from '../../../environments/environment';

/** טופס הוספת מוצר — תבנית כמו בהוראות: ‎ngModel‎ + ‎ngSubmit‎ */
@Component({
  selector: 'app-add-product-page',
  standalone: true,
  imports: [FormsModule, MatButtonModule, RouterLink],
  template: `
    <section class="lux-section">
      <div class="lux-container narrow">
        <h1>הוספת מוצר</h1>
        <p class="muted">
          השמירה לשרת דורשת הרשאת ניהול
          (<a routerLink="/login">התחברות</a>). ללא הרשאה תקבלי שגיאת 403.
        </p>
        <form (ngSubmit)="add()">
          <div class="field">
            <label for="pname">שם</label>
            <input id="pname" type="text" name="name" [(ngModel)]="item.name" required />
          </div>
          <div class="field">
            <label for="pprice">מחיר</label>
            <input id="pprice" type="number" name="price" [(ngModel)]="item.price" min="0" step="1" />
          </div>
          <div class="field">
            <label for="pdesc">תיאור (אופציונלי)</label>
            <textarea id="pdesc" name="description" rows="3" [(ngModel)]="item.description"></textarea>
          </div>
          <button mat-flat-button color="primary" type="submit" [disabled]="sending || !item.name?.trim()">
            הוספת מוצר
          </button>
        </form>
        @if (status()) {
          <p class="status">{{ status() }}</p>
        }
        <p class="hint"><a routerLink="/list">לרשימת המוצרים</a></p>
      </div>
    </section>
  `,
  styles: `
    .narrow {
      max-width: 520px;
    }
    h1 {
      margin: 0 0 0.5rem;
    }
    .muted {
      color: var(--lux-muted);
      line-height: 1.6;
      margin: 0 0 1.25rem;
    }
    .field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.35rem;
      font-weight: 500;
    }
    input,
    textarea {
      width: 100%;
      padding: 0.55rem 0.65rem;
      border-radius: var(--lux-radius-sm);
      border: 1px solid var(--lux-line);
      font: inherit;
      box-sizing: border-box;
    }
    .status {
      margin-top: 1rem;
      color: var(--lux-muted);
    }
    .hint {
      margin-top: 1.5rem;
    }
  `
})
export class AddProductPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  /** כמו בהוראות: ‎item‎ עם ‎name‎ ו־‎price‎ — ממופה ל־API כ־title / price */
  item = { name: '', price: 0, description: '' };

  sending = false;
  readonly status = signal('');

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | הוספת מוצר`,
      description: 'טופס הוספת מוצר / חבילה.'
    });
  }

  add() {
    this.status.set('');
    this.sending = true;
    this.productService
      .addProduct({
        title: this.item.name.trim(),
        price: Number(this.item.price) || 0,
        description: this.item.description?.trim() || ''
      })
      .subscribe({
        next: () => {
          this.sending = false;
          this.item = { name: '', price: 0, description: '' };
          void this.router.navigate(['/list']);
        },
        error: (err) => {
          this.sending = false;
          if (err?.status === 401 || err?.status === 403) {
            this.status.set(
              'אין הרשאה. התחברי לאזור המנהל (אותו דפדפן) ונסי שוב, או השתמשי ב-API עם טוקן מנהל.'
            );
          } else {
            this.status.set('שגיאה בשמירה. נסי שוב מאוחר יותר.');
          }
        }
      });
  }
}
