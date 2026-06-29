import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { AuthDialogComponent } from '../../../features/auth/auth-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MobileMenuComponent],
  template: `
    <header class="nav" [class.open]="menuOpen()">
      <mat-toolbar class="toolbar lux-container">
        <a routerLink="/" class="logo" [attr.aria-label]="siteName">
          <img [src]="logoUrl" width="48" height="48" [alt]="siteName" />
        </a>
        <nav class="links desktop">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">בית</a>
          <a routerLink="/about" routerLinkActive="active">אודות</a>
          <a routerLink="/gallery" routerLinkActive="active">גלריה</a>
          <a routerLink="/contact" routerLinkActive="active">צור קשר</a>
        </nav>
        <span class="spacer"></span>
        <a mat-stroked-button class="cta desktop" routerLink="/contact">קביעת שיחה</a>
        @if (!auth.isLoggedIn()) {
          <button mat-stroked-button class="auth-action desktop" type="button" (click)="openAuth()">התחברות</button>
        } @else {
          <div class="account desktop">
            <button
              mat-stroked-button
              class="auth-action"
              type="button"
              (click)="toggleAccountMenu()"
              [attr.aria-expanded]="accountMenuOpen()"
            >
              {{ auth.user()?.name || auth.user()?.email || 'החשבון שלי' }}
            </button>
            @if (accountMenuOpen()) {
              <div class="account-menu">
                <button type="button" (click)="logout()">יציאה</button>
              </div>
            }
          </div>
        }
        <button mat-icon-button class="burger" (click)="toggle()" aria-label="תפריט">
          <mat-icon>{{ menuOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
      </mat-toolbar>
      @if (menuOpen()) {
        <div class="lux-container">
          <app-mobile-menu [open]="menuOpen()" (navigate)="close()" />
        </div>
      }
    </header>
  `,
  styles: `
    .nav {
      position: sticky;
      top: 0;
      z-index: 40;
      backdrop-filter: blur(14px);
      background: color-mix(in srgb, var(--lux-bg) 78%, transparent);
      border-bottom: 1px solid var(--lux-line);
    }
    .toolbar {
      gap: 1.15rem;
      height: 84px;
      padding-inline-start: clamp(0.25rem, 1vw, 0.5rem);
      padding-inline-end: clamp(0.85rem, 2.5vw, 1.35rem);
      align-items: center;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      text-decoration: none;
      color: inherit;
    }
    .logo img {
      height: 54px;
      width: auto;
      max-width: 180px;
      object-fit: contain;
      border-radius: 10px;
    }
    .links {
      display: flex;
      gap: 1.35rem;
      align-items: center;
    }
    .links a {
      font-size: 1.08rem;
      font-weight: 500;
      color: var(--lux-ink-soft);
      padding: 0.5rem 0.35rem;
      border-bottom: 1px solid transparent;
    }
    .link-button {
      border: 0;
      border-bottom: 1px solid transparent;
      background: transparent;
      color: var(--lux-ink-soft);
      cursor: pointer;
      font: inherit;
      font-size: 1.08rem;
      font-weight: 500;
      padding: 0.5rem 0.35rem;
    }
    .links a.active {
      border-color: var(--lux-accent);
      color: var(--lux-ink);
    }
    .cta.desktop {
      margin-inline-end: 0.45rem;
      font-size: 1.02rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding-inline: 1.15rem !important;
      min-height: 44px;
    }
    .auth-action.desktop {
      font-size: 1.02rem;
      font-weight: 500;
      min-height: 44px;
      padding-inline: 1.15rem !important;
    }
    .account {
      position: relative;
      display: inline-flex;
    }
    .account .auth-action {
      font-size: 1.02rem;
      font-weight: 500;
      min-height: 44px;
      padding-inline: 1.15rem !important;
    }
    .account-menu {
      position: absolute;
      top: calc(100% + 0.45rem);
      inset-inline-start: 0;
      min-width: 150px;
      border: 1px solid var(--lux-line);
      border-radius: var(--lux-radius-sm);
      background: var(--lux-bg-elevated);
      box-shadow: var(--lux-shadow-soft);
      padding: 0.35rem;
      z-index: 60;
    }
    .account-menu button {
      width: 100%;
      border: 0;
      background: transparent;
      color: var(--lux-ink-soft);
      cursor: pointer;
      font: inherit;
      padding: 0.55rem 0.75rem;
      text-align: start;
      border-radius: 8px;
    }
    .account-menu button:hover {
      background: var(--lux-button-stroked-fill-hover);
    }
    .spacer {
      flex: 1;
    }
    .burger {
      display: none;
      margin-inline-end: 0.5rem;
    }
    .mobile {
      display: none;
      padding-bottom: 1rem;
      flex-direction: column;
      gap: 0.6rem;
    }
    @media (max-width: 960px) {
      .desktop {
        display: none !important;
      }
      .burger {
        display: inline-flex;
      }
    }
  `
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly siteName = environment.siteName;
  readonly logoUrl = environment.logoUrl;
  readonly menuOpen = signal(false);
  readonly accountMenuOpen = signal(false);

  toggle() {
    this.menuOpen.update((v) => !v);
    this.accountMenuOpen.set(false);
  }

  close() {
    this.menuOpen.set(false);
  }

  toggleAccountMenu() {
    this.accountMenuOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  closeAccountMenuOnOutsideClick(event: MouseEvent) {
    if (!this.accountMenuOpen()) return;
    const target = event.target as Node | null;
    if (target && this.el.nativeElement.contains(target)) return;
    this.accountMenuOpen.set(false);
  }

  openAuth() {
    this.dialog.open(AuthDialogComponent, {
      direction: 'rtl',
      panelClass: 'lux-dialog',
      maxWidth: '94vw'
    });
  }

  logout() {
    this.auth.logout(null);
    this.accountMenuOpen.set(false);
    this.close();
  }
}
