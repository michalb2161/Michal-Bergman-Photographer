import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [RouterLink, MatButtonModule, FadeInDirective],
  template: `
    <section class="lux-section cta" appFadeIn>
      <div class="lux-container panel">
        <div class="copy">
          <h2>{{ title() }}</h2>
          <p>{{ subtitle() }}</p>
        </div>
        <div class="actions">
          <a mat-flat-button color="primary" [routerLink]="primaryLink()">{{ primaryLabel() }}</a>
          @if (secondaryLabel()) {
            <a mat-stroked-button [routerLink]="secondaryLink()">{{ secondaryLabel() }}</a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta {
      padding-block: clamp(3rem, 7vw, 5.5rem);
    }
    .panel {
      border-radius: var(--lux-radius-lg);
      background: linear-gradient(135deg, rgba(52, 46, 39, 0.95), rgba(62, 54, 46, 0.88));
      color: var(--lux-footer-text);
      padding: clamp(1.8rem, 4vw, 2.6rem);
      display: flex;
      flex-wrap: wrap;
      gap: 1.4rem;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--lux-shadow);
    }
    h2 {
      color: var(--lux-brand-cream);
      margin: 0 0 0.4rem;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
    }
    p {
      margin: 0;
      color: color-mix(in srgb, var(--lux-brand-cream) 78%, transparent);
      max-width: 520px;
      line-height: 1.7;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
  `
})
export class CtaSectionComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly primaryLabel = input.required<string>();
  readonly primaryLink = input.required<string>();
  readonly secondaryLabel = input<string>('');
  readonly secondaryLink = input<string>('/contact');
}
