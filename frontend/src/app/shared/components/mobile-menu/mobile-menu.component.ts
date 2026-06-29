import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (open()) {
      <div class="panel" role="dialog" aria-modal="true">
        <a routerLink="/" (click)="pick()">בית</a>
        <a routerLink="/about" (click)="pick()">אודות</a>
        <a routerLink="/gallery" (click)="pick()">גלריה</a>
        <a routerLink="/contact" (click)="pick()">צור קשר</a>
      </div>
    }
  `,
  styles: `
    .panel {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      padding: 0.25rem 0 1rem;
    }
    a {
      padding: 0.65rem 0;
      font-size: 1.08rem;
      font-weight: 500;
      border-bottom: 1px solid var(--lux-line);
      color: var(--lux-ink-soft);
    }
  `
})
export class MobileMenuComponent {
  readonly open = input(false);
  readonly navigate = output<void>();

  pick() {
    this.navigate.emit();
  }
}
