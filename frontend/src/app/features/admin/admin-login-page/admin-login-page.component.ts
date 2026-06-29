import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="page">
      <mat-card class="card">
        <h1>התחברות</h1>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>אימייל או שם משתמש</mat-label>
            <input matInput formControlName="identifier" autocomplete="username" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>סיסמה</mat-label>
            <input matInput type="password" formControlName="password" />
          </mat-form-field>
          <button mat-flat-button color="primary" class="full" type="submit" [disabled]="form.invalid || busy">
            כניסה
          </button>
          @if (error) {
            <p class="error">{{ error }}</p>
          }
        </form>
      </mat-card>
    </div>
  `,
  styles: `
    .page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at top, var(--lux-brand-cream), var(--lux-surface-mid));
      padding: 1rem;
    }
    .card {
      width: min(420px, 100%);
      padding: 1.2rem;
    }
    h1 {
      margin: 0 0 1rem;
      font-size: 1.4rem;
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
export class AdminLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  busy = false;
  error = '';

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) return;
    this.busy = true;
    this.error = '';
    const raw = this.form.getRawValue();
    this.auth.login(raw.identifier, raw.password).subscribe({
      next: () => {
        this.busy = false;
        void this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.busy = false;
        this.error = 'התחברות נכשלה';
      }
    });
  }
}
