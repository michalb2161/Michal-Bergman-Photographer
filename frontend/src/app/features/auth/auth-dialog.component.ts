import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="wrap">
      <h2 mat-dialog-title>{{ mode() === 'login' ? 'התחברות' : 'הרשמה' }}</h2>
      <mat-dialog-content>
        @if (mode() === 'login') {
          <p class="switch top">
            עוד לא נרשמת?
            <button mat-stroked-button type="button" (click)="mode.set('register')">
              הרשמה לפני התחברות
            </button>
          </p>
          <form [formGroup]="loginForm" (ngSubmit)="login()" class="form">
            <mat-form-field appearance="outline">
              <mat-label>אימייל או שם משתמש</mat-label>
              <input matInput formControlName="identifier" autocomplete="username" />
              @if (loginForm.controls.identifier.touched && loginForm.controls.identifier.invalid) {
                <mat-error>הכניסי אימייל או שם משתמש</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>סיסמה</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="current-password" />
              @if (loginForm.controls.password.touched && loginForm.controls.password.invalid) {
                <mat-error>סיסמה חייבת להכיל לפחות 6 תווים</mat-error>
              }
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="busy()">
              התחברות
            </button>
          </form>
          <p class="switch bottom">אין לך עדיין משתמש? <button type="button" (click)="mode.set('register')">לחצי כאן להרשמה</button></p>
        } @else {
          <form [formGroup]="registerForm" (ngSubmit)="register()" class="form">
            <mat-form-field appearance="outline">
              <mat-label>שם מלא</mat-label>
              <input matInput formControlName="name" />
              @if (registerForm.controls.name.touched && registerForm.controls.name.invalid) {
                <mat-error>שדה חובה</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>אימייל</mat-label>
              <input matInput type="email" formControlName="email" />
              @if (registerForm.controls.email.touched && registerForm.controls.email.invalid) {
                <mat-error>אימייל לא תקין</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>סיסמה</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="new-password" />
              @if (registerForm.controls.password.touched && registerForm.controls.password.invalid) {
                <mat-error>סיסמה חייבת להכיל לפחות 8 תווים</mat-error>
              }
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="busy()">
              הרשמה
            </button>
          </form>
          <p class="switch bottom">כבר נרשמת? <button type="button" (click)="mode.set('login')">התחברות</button></p>
        }

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>סגירה</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    .wrap {
      direction: rtl;
      width: min(92vw, 430px);
    }
    .form {
      display: grid;
      gap: 0.75rem;
    }
    .switch {
      color: var(--lux-muted);
      line-height: 1.6;
      margin: 0 0 1rem;
    }
    .switch.top {
      display: grid;
      gap: 0.55rem;
      padding: 0.85rem;
      border: 1px solid var(--lux-line);
      border-radius: var(--lux-radius-sm);
      background: var(--lux-bg-elevated);
    }
    .switch.bottom {
      margin: 1rem 0 0;
    }
    .switch button:not([mat-stroked-button]) {
      border: 0;
      background: transparent;
      color: var(--lux-ink);
      cursor: pointer;
      font: inherit;
      padding: 0;
      text-decoration: underline;
    }
    .error {
      color: #b00020;
      margin: 0.75rem 0 0;
    }
  `
})
export class AuthDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly ref = inject(MatDialogRef<AuthDialogComponent>);

  readonly mode = signal<'login' | 'register'>('login');
  readonly busy = signal(false);
  readonly error = signal('');

  readonly loginForm = this.fb.nonNullable.group({
    identifier: [this.auth.lastIdentifier(), [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    const raw = this.loginForm.getRawValue();
    this.auth.login(raw.identifier, raw.password).subscribe({
      next: () => {
        this.busy.set(false);
        this.ref.close(true);
      },
      error: () => {
        this.busy.set(false);
        this.error.set('התחברות נכשלה');
      }
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.auth.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.busy.set(false);
        this.ref.close(true);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message || 'הרשמה נכשלה');
      }
    });
  }
}
