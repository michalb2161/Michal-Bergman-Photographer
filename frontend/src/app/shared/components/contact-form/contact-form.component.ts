import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>שם מלא</mat-label>
        <input matInput formControlName="name" />
        @if (form.controls.name.touched && form.controls.name.invalid) {
          <mat-error>שדה חובה</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>אימייל</mat-label>
        <input matInput type="email" formControlName="email" />
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <mat-error>אימייל לא תקין</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>טלפון</mat-label>
        <input matInput formControlName="phone" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full">
        <mat-label>הודעה</mat-label>
        <textarea matInput rows="5" formControlName="message"></textarea>
        @if (form.controls.message.touched && form.controls.message.invalid) {
          <mat-error>נא לכתוב לפחות 10 תווים</mat-error>
        }
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || sending">
        שליחה
      </button>
      @if (status) {
        <p class="status">{{ status }}</p>
      }
    </form>
  `,
  styles: `
    .form {
      display: grid;
      gap: 0.75rem;
    }
    .full {
      grid-column: 1 / -1;
    }
    @media (min-width: 720px) {
      .form {
        grid-template-columns: 1fr 1fr;
      }
    }
    .status {
      grid-column: 1 / -1;
      margin: 0.25rem 0 0;
      color: var(--lux-muted);
    }
  `
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PortfolioApiService);
  private readonly auth = inject(AuthService);
  readonly submitted = output<string>();

  sending = false;
  status = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    this.status = '';
    const raw = this.form.getRawValue();
    const username = (this.auth.user()?.username || raw.email).trim().toLowerCase();
    this.api.sendContact({ ...raw, username }).subscribe({
      next: (res) => {
        this.sending = false;
        this.status = res.success ? 'הפרטים נשמרו במערכת.' : 'ההודעה נשמרה.';
        this.form.reset();
        this.submitted.emit(res.data?.username || username);
      },
      error: () => {
        this.sending = false;
        this.status = 'אירעה שגיאה בשליחה. נסו שוב מאוחר יותר.';
      }
    });
  }
}
