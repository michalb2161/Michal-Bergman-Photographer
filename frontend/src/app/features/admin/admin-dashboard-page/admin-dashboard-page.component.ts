import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <h1>דשבורד</h1>
    <div class="grid">
      @for (card of cards(); track card.label) {
        <mat-card class="card">
          <div class="label">{{ card.label }}</div>
          <div class="value">{{ card.value }}</div>
        </mat-card>
      }
    </div>
  `,
  styles: `
    h1 {
      margin-top: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
    }
    .card {
      padding: 1rem;
    }
    .label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.85rem;
    }
    .value {
      font-size: 1.8rem;
      font-weight: 600;
      margin-top: 0.35rem;
    }
  `
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  readonly cards = signal<{ label: string; value: number }[]>([]);

  ngOnInit() {
    this.api.adminStats().subscribe((res) => {
      const d = res.data || {};
      this.cards.set([
        { label: 'תמונות', value: d['images'] ?? 0 },
        { label: 'קטגוריות', value: d['categories'] ?? 0 },
        { label: 'הודעות', value: d['messages'] ?? 0 },
        { label: 'לא נקראו', value: d['unreadMessages'] ?? 0 },
        { label: 'המלצות', value: d['testimonialsTotal'] ?? 0 }
      ]);
    });
  }
}
