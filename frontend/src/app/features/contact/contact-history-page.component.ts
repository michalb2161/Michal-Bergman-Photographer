import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { ContactMessage } from '../../core/models/portfolio.models';
import { SeoService } from '../../core/services/seo.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contact-history-page',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <section class="lux-section">
      <div class="lux-container">
        <h1>היסטוריית פניות</h1>
        <p class="muted">הכניסי את שם המשתמש שהזנת בטופס יצירת הקשר כדי לראות את הפניות שנשלחו ממנו.</p>

        <form [formGroup]="form" (ngSubmit)="load()" class="lookup">
          <mat-form-field appearance="outline">
            <mat-label>שם משתמש</mat-label>
            <input matInput formControlName="username" autocomplete="username" />
            @if (form.controls.username.touched && form.controls.username.invalid) {
              <mat-error>שם משתמש חייב להכיל לפחות 2 תווים</mat-error>
            }
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            הצגת היסטוריה
          </button>
        </form>

        @if (status()) {
          <p class="status">{{ status() }}</p>
        }

        <div class="cards">
          @for (msg of messages(); track msg._id) {
            <article class="card">
              <div class="meta">{{ msg.createdAt | date: 'dd/MM/yyyy HH:mm' }}</div>
              <h2>{{ msg.name }}</h2>
              <p class="line">אימייל: {{ msg.email }}</p>
              @if (msg.phone) {
                <p class="line">טלפון: {{ msg.phone }}</p>
              }
              <p class="message">{{ msg.message }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    h1 {
      margin: 0 0 0.4rem;
    }
    .muted,
    .status,
    .meta,
    .line {
      color: var(--lux-muted);
    }
    .lookup {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin: 1.25rem 0 1.5rem;
    }
    mat-form-field {
      min-width: min(100%, 320px);
    }
    .cards {
      display: grid;
      gap: 0.9rem;
    }
    .card {
      border: 1px solid var(--lux-line);
      border-radius: var(--lux-radius-md);
      background: var(--lux-bg-elevated);
      padding: 1rem;
      box-shadow: var(--lux-shadow-soft);
    }
    h2 {
      margin: 0.25rem 0 0.5rem;
      font-size: 1.25rem;
    }
    .line {
      margin: 0.2rem 0;
    }
    .message {
      margin: 0.75rem 0 0;
      line-height: 1.7;
      white-space: pre-wrap;
    }
  `
})
export class ContactHistoryPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly status = signal('');
  readonly messages = signal<ContactMessage[]>([]);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | היסטוריית פניות`,
      description: 'צפייה בהיסטוריית טפסי יצירת קשר לפי שם משתמש.'
    });
    const username = this.auth.user()?.username;
    if (username) {
      this.form.controls.username.setValue(username);
      this.load();
    }
  }

  load() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const username = this.form.controls.username.value.trim();
    this.loading.set(true);
    this.status.set('');
    this.messages.set([]);
    this.api.getContactHistory(username).subscribe({
      next: (res) => {
        const data = res.data || [];
        this.messages.set(data);
        this.status.set(data.length ? '' : 'לא נמצאו פניות עבור שם המשתמש הזה.');
        this.loading.set(false);
      },
      error: () => {
        this.status.set('לא ניתן לטעון את ההיסטוריה כרגע.');
        this.loading.set(false);
      }
    });
  }
}
