import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="page">
      <mat-card class="card">
        <h1>התחברות</h1>
        <div class="register-first">
          <span>עוד לא נרשמת?</span>
          <a mat-stroked-button routerLink="/register">הרשמה לפני התחברות</a>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>אימייל או שם משתמש</mat-label>
            <input matInput formControlName="identifier" autocomplete="username" />
            @if (form.controls.identifier.touched && form.controls.identifier.invalid) {
              <mat-error>הכניסי אימייל או שם משתמש</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>סיסמה</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" />
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <mat-error>סיסמה חייבת להכיל לפחות 6 תווים</mat-error>
            }
          </mat-form-field>
          <button mat-flat-button color="primary" class="full" type="submit" [disabled]="busy">
            התחברות
          </button>
          @if (error) {
            <p class="error">{{ error }}</p>
          }
          <p class="switch">אין לך עדיין משתמש? <a routerLink="/register">לחצי כאן להרשמה</a></p>
        </form>
      </mat-card>
    </div>
  `,
  styles: `
    .page {
      min-height: calc(100vh - 84px);
      display: grid;
      place-items: center;
      padding: 1rem;
    }
    .card {
      width: min(440px, 100%);
      padding: 1.2rem;
    }
    h1 {
      margin: 0 0 0.75rem;
      font-size: 1.55rem;
    }
    .register-first {
      display: grid;
      gap: 0.55rem;
      margin-bottom: 1rem;
      padding: 0.85rem;
      border: 1px solid var(--lux-line);
      border-radius: var(--lux-radius-sm);
      background: var(--lux-bg-elevated);
      color: var(--lux-muted);
    }
    .full {
      width: 100%;
    }
    .switch {
      color: var(--lux-muted);
      line-height: 1.6;
    }
    .error {
      color: #b00020;
      margin-top: 0.6rem;
    }
  `
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  busy = false;
  error = '';

  readonly form = this.fb.nonNullable.group({
    identifier: [this.auth.lastIdentifier(), [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy = true;
    this.error = '';
    const raw = this.form.getRawValue();
    this.auth.login(raw.identifier, raw.password).subscribe({
      next: (res) => {
        this.busy = false;
        const target = res.user.role === 'admin' ? '/admin/dashboard' : '/contact-history';
        void this.router.navigate([target]);
      },
      error: () => {
        this.busy = false;
        this.error = 'התחברות נכשלה';
      }
    });
  }
}
