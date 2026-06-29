import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { AuthDialogComponent } from '../../../features/auth/auth-dialog.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="lux-container grid">
        <div>
          <div class="brand-row">
            <img [src]="logoUrl" width="40" height="40" alt="" />
            <div class="brand">{{ siteName }}</div>
          </div>
          <p class="muted">צילום מקצועי — חוץ, סטודיו, מוצר וניובורן.</p>
        </div>
        <div>
          <div class="label">ניווט</div>
          <nav class="links">
            <a routerLink="/">בית</a>
            <a routerLink="/about">אודות</a>
            <a routerLink="/gallery">גלריה</a>
            <a routerLink="/contact">צור קשר</a>
          </nav>
        </div>
        <div>
          <div class="label">מייל</div>
          <div class="links">
            <a [href]="'mailto:' + contactEmail">{{ contactEmail }}</a>
          </div>
        </div>
      </div>
      <div class="bar">
        <div class="lux-container bar-inner">
          <span>© {{ year }} {{ siteName }}. כל הזכויות שמורות.</span>
          <button type="button" class="admin" (click)="openAuth()">התחברות</button>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      margin-top: 3rem;
      border-top: 1px solid color-mix(in srgb, var(--lux-brand-sand) 35%, transparent);
      background: var(--lux-footer-bg);
      color: var(--lux-footer-text);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.6rem;
      padding: 2.6rem 0 2rem;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.4rem;
    }
    .brand-row img {
      border-radius: 8px;
      object-fit: contain;
    }
    .brand {
      font-family: var(--lux-font-display);
      font-size: 1.35rem;
      letter-spacing: 0.08em;
    }
    .muted {
      color: var(--lux-footer-muted);
      line-height: 1.7;
      margin: 0;
    }
    .label {
      text-transform: uppercase;
      letter-spacing: 0.22em;
      font-size: 0.68rem;
      opacity: 0.65;
      margin-bottom: 0.6rem;
    }
    .links {
      display: grid;
      gap: 0.45rem;
    }
    .links a {
      color: color-mix(in srgb, var(--lux-footer-text) 90%, var(--lux-brand-sand));
    }
    .bar {
      border-top: 1px solid rgba(246, 241, 232, 0.12);
    }
    .bar-inner {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding: 0.9rem 0;
      font-size: 0.85rem;
      color: var(--lux-footer-muted);
    }
    .admin {
      border: 0;
      background: transparent;
      color: color-mix(in srgb, var(--lux-footer-text) 55%, transparent);
      cursor: pointer;
      font: inherit;
      padding: 0;
    }
  `
})
export class FooterComponent {
  private readonly dialog = inject(MatDialog);
  readonly year = new Date().getFullYear();
  readonly siteName = environment.siteName;
  readonly logoUrl = environment.logoUrl;
  readonly contactEmail = environment.contactEmail;

  openAuth() {
    this.dialog.open(AuthDialogComponent, {
      direction: 'rtl',
      panelClass: 'lux-dialog',
      maxWidth: '94vw'
    });
  }
}
