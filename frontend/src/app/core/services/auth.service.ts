import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { readStoredToken, writeStoredToken } from '../interceptors/auth.interceptor';

const LAST_IDENTIFIER_KEY = 'lux_last_identifier';

export interface AuthUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly token = signal<string | null>(readStoredToken());
  readonly isLoggedIn = computed(() => !!this.token());
  readonly user = signal<AuthUser | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    if (this.token()) {
      this.refreshProfile().subscribe({ error: () => this.logoutLocal() });
    }
  }

  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  login(identifier: string, password: string) {
    return this.http
      .post<{ success: boolean; token: string; user: AuthUser }>(
        `${environment.apiUrl}/auth/login`,
        // שולחים גם `email` לשמירת תאימות אם שרת dev עדיין רץ עם גרסה ישנה של ה-route.
        { identifier, email: identifier, password }
      )
      .pipe(
        tap((res) => {
          writeStoredToken(res.token);
          this.token.set(res.token);
          this.user.set(res.user);
          this.rememberIdentifier(res.user);
        })
      );
  }

  register(body: { name: string; email: string; password: string }) {
    return this.http
      .post<{ success: boolean; token: string; user: AuthUser }>(
        `${environment.apiUrl}/auth/register`,
        body
      )
      .pipe(
        tap((res) => {
          writeStoredToken(res.token);
          this.token.set(res.token);
          this.user.set(res.user);
          this.rememberIdentifier(res.user);
        })
      );
  }

  logoutLocal() {
    const current = this.user();
    if (current) this.rememberIdentifier(current);
    writeStoredToken(null);
    this.token.set(null);
    this.user.set(null);
  }

  logout(redirectTo: string | null = '/login') {
    this.logoutLocal();
    if (redirectTo) {
      void this.router.navigate([redirectTo]);
    }
  }

  refreshProfile() {
    return this.http.get<{ success: boolean; user: AuthUser }>(`${environment.apiUrl}/auth/me`).pipe(
      tap((res) => {
        this.user.set(res.user);
        this.rememberIdentifier(res.user);
      })
    );
  }

  lastIdentifier(): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(LAST_IDENTIFIER_KEY) || '';
  }

  private rememberIdentifier(user: AuthUser) {
    if (typeof localStorage === 'undefined') return;
    const identifier = user.username || user.email || '';
    if (identifier) localStorage.setItem(LAST_IDENTIFIER_KEY, identifier);
  }
}
