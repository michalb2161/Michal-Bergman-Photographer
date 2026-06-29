import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="page">
      <mat-card class="card">
        <h1>הרשמה</h1>
        <p class="muted">נרשמים פעם אחת, ואז אפשר להתחבר ולראות היסטוריית פניות.</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>שם מלא</mat-label>
            <input matInput formControlName="name" />
            @if (form.controls.name.touched && form.controls.name.invalid) {
              <mat-error>שדה חובה</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>אימייל</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <mat-error>אימייל לא תקין</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>סיסמה</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <mat-error>סיסמה חייבת להכיל לפחות 8 תווים</mat-error>
            }
          </mat-form-field>
          <button mat-flat-button color="primary" class="full" type="submit" [disabled]="busy">
            הרשמה
          </button>
          @if (error) {
            <p class="error">{{ error }}</p>
          }
          <p class="switch">כבר נרשמת? <a routerLink="/login">התחברות</a></p>
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
      width: min(460px, 100%);
      padding: 1.2rem;
    }
    h1 {
      margin: 0 0 0.35rem;
      font-size: 1.55rem;
    }
    .muted,
    .switch {
      color: var(--lux-muted);
      line-height: 1.6;
    }
    .full {
      width: 100%;
    }
    .error {
      color: #b00020;
      margin-top: 0.6rem;
    }
  `
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  busy = false;
  error = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy = true;
    this.error = '';
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.busy = false;
        void this.router.navigate(['/contact-history']);
      },
      error: (err) => {
        this.busy = false;
        this.error = err?.error?.message || 'הרשמה נכשלה';
      }
    });
  }
}
