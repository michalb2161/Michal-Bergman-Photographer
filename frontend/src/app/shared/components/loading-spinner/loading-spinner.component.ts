import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="wrap" role="status" aria-label="טוען">
      <mat-spinner diameter="44" />
    </div>
  `,
  styles: `
    .wrap {
      display: grid;
      place-items: center;
      padding: 2rem;
      color: var(--lux-accent);
    }
  `
})
export class LoadingSpinnerComponent {}
