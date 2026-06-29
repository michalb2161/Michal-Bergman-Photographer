import { Component, input } from '@angular/core';
import { Testimonial } from '../../../core/models/portfolio.models';
import { MatCardModule } from '@angular/material/card';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [MatCardModule, FadeInDirective],
  template: `
    <div class="grid">
      @for (t of items(); track t._id; let i = $index) {
        <mat-card class="card" appFadeIn [appFadeInDelay]="i * 90">
          <mat-card-content>
            <p class="quote">“{{ t.text }}”</p>
            <div class="meta">
              <span class="name">{{ t.authorName }}</span>
              <span class="stars">{{ stars(t.rating || 5) }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .card {
      border-radius: var(--lux-radius-md);
      border: 1px solid var(--lux-line);
      background: var(--lux-bg-elevated);
      box-shadow: var(--lux-shadow-soft);
    }
    .quote {
      margin: 0 0 1rem;
      line-height: 1.8;
      color: var(--lux-ink-soft);
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .name {
      font-weight: 600;
      color: var(--lux-ink);
    }
    .stars {
      color: var(--lux-accent);
      letter-spacing: 0.08em;
    }
  `
})
export class TestimonialsComponent {
  readonly items = input<Testimonial[]>([]);

  stars(n: number) {
    return '★'.repeat(Math.min(5, Math.max(1, n)));
  }
}
