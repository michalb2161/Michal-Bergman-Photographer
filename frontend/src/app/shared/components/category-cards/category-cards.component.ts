import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { Category } from '../../../core/models/portfolio.models';
import { environment } from '../../../../environments/environment';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-category-cards',
  standalone: true,
  imports: [RouterLink, MatCardModule, FadeInDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid" appFadeIn>
      @for (c of categories(); track c._id) {
        <a class="card-link" [routerLink]="['/gallery']" [queryParams]="{ category: c._id }">
          <mat-card class="card">
            <div class="media" [style.background-image]="coverStyle(c)"></div>
            <mat-card-content>
              <h3>{{ c.nameHe }}</h3>
              <p>{{ c.description }}</p>
            </mat-card-content>
          </mat-card>
        </a>
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .card-link {
      text-decoration: none;
      color: inherit;
    }
    .card {
      border-radius: var(--lux-radius-md);
      overflow: hidden;
      border: 1px solid var(--lux-line);
      background: var(--lux-bg-elevated);
      transition: transform 0.35s ease, box-shadow 0.35s ease;
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: var(--lux-shadow-soft);
    }
    .media {
      height: 160px;
      background-size: cover;
      background-position: center;
    }
    h3 {
      margin: 0.4rem 0 0.2rem;
      font-size: 1.15rem;
    }
    p {
      margin: 0;
      color: var(--lux-muted);
      font-size: 0.92rem;
      line-height: 1.5;
    }
  `
})
export class CategoryCardsComponent {
  private readonly api = inject(PortfolioApiService);
  readonly categories = input<Category[]>([]);
  private readonly fallback = environment.logoUrl;

  coverStyle(c: Category): string {
    const raw = c.coverImageUrl?.trim();
    const url = raw ? this.api.absoluteMedia(raw) : this.fallback;
    return `url('${url.replace(/'/g, '%27')}')`;
  }
}
