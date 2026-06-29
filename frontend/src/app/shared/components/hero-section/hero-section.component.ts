import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  inject,
  input,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { defaultHeroBackgroundUrl } from '../../../core/utils/hero-background';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" [style.--hero-image]="'url(' + imageUrl() + ')'">
      <div class="bg" [style.transform]="'translateY(' + offset() + 'px)'"></div>
      <div class="overlay"></div>
      <div class="content lux-container">
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
        <p class="lede">{{ subtitle() }}</p>
        <div class="actions">
          <a mat-flat-button color="primary" [routerLink]="primaryLink()">{{ primaryLabel() }}</a>
          <a mat-stroked-button class="ghost" [routerLink]="secondaryLink()">{{ secondaryLabel() }}</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: min(92vh, 900px);
      display: grid;
      align-items: end;
      color: #f7f1e8;
      overflow: hidden;
    }
    .bg {
      position: absolute;
      inset: -12% 0 -8%;
      background-image: var(--hero-image);
      background-size: cover;
      background-position: center;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: var(--lux-hero-overlay);
    }
    .content {
      position: relative;
      padding: clamp(4rem, 10vw, 7rem) 0 clamp(2.6rem, 6vw, 4rem);
    }
    .eyebrow {
      letter-spacing: 0.32em;
      text-transform: uppercase;
      font-size: 0.72rem;
      opacity: 0.78;
      margin: 0 0 0.8rem;
    }
    .hero h1 {
      font-size: clamp(2.4rem, 5vw, 4.1rem);
      line-height: 1.05;
      margin: 0 0 1rem;
      color: #fdf6ea;
    }
    .lede {
      max-width: 560px;
      font-size: 1.05rem;
      line-height: 1.8;
      color: rgba(247, 241, 232, 0.82);
      margin: 0 0 1.6rem;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .ghost {
      color: #fdf6ea;
      border-color: rgba(253, 246, 234, 0.45);
    }
  `
})
export class HeroSectionComponent {
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly eyebrow = input('צילום אמנותי');
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly imageUrl = input(defaultHeroBackgroundUrl());
  readonly primaryLabel = input('גלריה');
  readonly primaryLink = input('/gallery');
  readonly secondaryLabel = input('צור קשר');
  readonly secondaryLink = input('/contact');

  readonly offset = signal(0);

  private rafId = 0;
  private lastParallaxPx = 0;

  constructor() {
    afterNextRender(() => {
      const onScroll = () => {
        if (this.rafId !== 0) return;
        this.rafId = requestAnimationFrame(() => {
          this.rafId = 0;
          const y = window.scrollY || 0;
          const next = Math.round(y * 0.22);
          if (next === this.lastParallaxPx) return;
          this.lastParallaxPx = next;
          this.ngZone.run(() => this.offset.set(next));
        });
      };
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
      });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        if (this.rafId !== 0) {
          cancelAnimationFrame(this.rafId);
          this.rafId = 0;
        }
      });
    });
  }
}
