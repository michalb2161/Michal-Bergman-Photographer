import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <section class="wrap lux-section">
      <div class="lux-container center">
        <p class="code">404</p>
        <h1>העמוד לא נמצא</h1>
        <p class="muted">נראה שהגעתם לשביל צדדי. בואו נחזור לאור הרך של הבית.</p>
        <a mat-flat-button color="primary" routerLink="/">חזרה לבית</a>
      </div>
    </section>
  `,
  styles: `
    .center {
      text-align: center;
      padding: 4rem 0;
    }
    .code {
      font-family: var(--lux-font-display);
      font-size: 3rem;
      margin: 0;
      color: var(--lux-accent);
    }
    h1 {
      margin: 0.4rem 0;
    }
    .muted {
      color: var(--lux-muted);
      margin: 0 0 1.2rem;
    }
  `
})
export class NotFoundPageComponent {}
