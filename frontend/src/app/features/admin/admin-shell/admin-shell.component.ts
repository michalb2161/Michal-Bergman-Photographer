import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav mode="side" opened class="nav">
        <div class="brand">{{ siteName }} — ניהול</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">דשבורד</a>
          <a mat-list-item routerLink="/admin/images" routerLinkActive="active">תמונות</a>
          <a mat-list-item routerLink="/admin/categories" routerLinkActive="active">קטגוריות</a>
          <a mat-list-item routerLink="/admin/messages" routerLinkActive="active">הודעות</a>
          <a mat-list-item routerLink="/admin/homepage" routerLinkActive="active">בית</a>
          <a mat-list-item routerLink="/">אתר ציבורי</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span class="spacer"></span>
          <button mat-button type="button" (click)="logout()">יציאה</button>
        </mat-toolbar>
        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .shell {
      min-height: 100vh;
    }
    .nav {
      width: 230px;
      padding-top: 0.5rem;
    }
    .brand {
      padding: 1rem 1rem 0.5rem;
      font-weight: 600;
    }
    a.active {
      background: rgba(0, 0, 0, 0.06);
    }
    .content {
      padding: 1rem;
    }
    .spacer {
      flex: 1;
    }
  `
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  readonly siteName = environment.siteName;

  logout() {
    this.auth.logout();
  }
}
