import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../core/services/seo.service';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form.component';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { ContactMessage } from '../../core/models/portfolio.models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [DatePipe, FormsModule, ContactFormComponent, MatButtonModule],
  template: `
    <section class="lux-section">
      <div class="lux-container">
        <h1>צור קשר</h1>
        <p class="muted">ספרו לי קצת על היום שלכם — אחזור במייל עם זמינות והמלצות.</p>
        <div class="actions">
          <a mat-flat-button color="primary" [href]="'mailto:' + email">שליחת מייל</a>
        </div>
        <app-contact-form (submitted)="loadHistory($event)" />

        @if (historyLoaded()) {
          <section class="history">
            <h2>היסטוריית הפניות שלך</h2>
            @if (historyStatus()) {
              <p class="muted">{{ historyStatus() }}</p>
            }
            <div class="cards">
              @for (msg of messages(); track msg._id) {
                <article class="card">
                  <div class="meta">{{ msg.createdAt | date: 'dd/MM/yyyy HH:mm' }}</div>
                  <strong>{{ msg.name }}</strong>
              @if (editingId() === msg._id) {
                <textarea class="edit-box" [(ngModel)]="editText" rows="4"></textarea>
                <div class="card-actions">
                  <button mat-flat-button color="primary" type="button" (click)="saveEdit(msg)">
                    שמירה
                  </button>
                  <button mat-button type="button" (click)="cancelEdit()">ביטול</button>
                </div>
              } @else {
                <p>{{ msg.message }}</p>
                <div class="card-actions">
                  <button mat-stroked-button type="button" (click)="startEdit(msg)">עריכה</button>
                  <button mat-button color="warn" type="button" (click)="removeMessage(msg)">מחיקה</button>
                </div>
              }
                </article>
              }
            </div>
          </section>
        }
      </div>
    </section>
  `,
  styles: `
    h1 {
      margin: 0 0 0.4rem;
    }
    .muted {
      margin: 0 0 1rem;
      color: var(--lux-muted);
      line-height: 1.7;
    }
    .actions {
      display: flex;
      gap: 0.6rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .history {
      margin-top: 2rem;
    }
    .history h2 {
      margin: 0 0 1rem;
      font-size: clamp(1.45rem, 2.5vw, 2rem);
    }
    .cards {
      display: grid;
      gap: 0.85rem;
    }
    .card {
      border: 1px solid var(--lux-line);
      border-radius: var(--lux-radius-md);
      background: var(--lux-bg-elevated);
      padding: 1rem;
      box-shadow: var(--lux-shadow-soft);
    }
    .card p {
      margin: 0.55rem 0 0;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .edit-box {
      width: 100%;
      margin-top: 0.75rem;
      min-height: 110px;
      padding: 0.65rem;
      border: 1px solid var(--lux-line);
      border-radius: var(--lux-radius-sm);
      box-sizing: border-box;
      font: inherit;
      line-height: 1.6;
      resize: vertical;
    }
    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
      margin-top: 0.8rem;
    }
    .meta {
      color: var(--lux-muted);
      font-size: 0.9rem;
      margin-bottom: 0.35rem;
    }
  `
})
export class ContactPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly api = inject(PortfolioApiService);
  private readonly auth = inject(AuthService);
  readonly email = environment.contactEmail;
  readonly historyLoaded = signal(false);
  readonly historyStatus = signal('');
  readonly messages = signal<ContactMessage[]>([]);
  readonly editingId = signal<string | null>(null);
  private readonly historyKey = signal('');
  editText = '';

  ngOnInit() {
    this.seo.setPage({
      title: `${environment.siteName} | צור קשר`,
      description: 'יצירת קשר עם מיכל ברגמן צלמת.'
    });
    const currentUser = this.auth.user();
    const historyKey = currentUser?.username || currentUser?.email;
    if (historyKey) {
      this.loadHistory(historyKey);
    }
  }

  loadHistory(username: string) {
    const historyKey = username.trim().toLowerCase();
    if (!historyKey) return;
    this.historyKey.set(historyKey);
    this.historyLoaded.set(true);
    this.historyStatus.set('טוען היסטוריה...');
    this.messages.set([]);
    this.api.getContactHistory(historyKey).subscribe({
      next: (res) => {
        const data = res.data || [];
        this.messages.set(data);
        this.historyStatus.set(data.length ? '' : 'עדיין אין פניות קודמות להצגה.');
      },
      error: () => {
        this.historyStatus.set('לא ניתן לטעון את היסטוריית הפניות כרגע.');
      }
    });
  }

  startEdit(msg: ContactMessage) {
    this.editingId.set(msg._id);
    this.editText = msg.message;
    this.historyStatus.set('');
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editText = '';
  }

  saveEdit(msg: ContactMessage) {
    const text = this.editText.trim();
    if (text.length < 10) {
      this.historyStatus.set('נא לכתוב לפחות 10 תווים.');
      return;
    }
    this.api.updateContactHistoryMessage(this.historyKey(), msg._id, text, msg.email).subscribe({
      next: (res) => {
        const updated = res.data;
        this.messages.update((items) => items.map((item) => (item._id === updated._id ? updated : item)));
        this.cancelEdit();
        this.historyStatus.set('ההודעה עודכנה.');
      },
      error: () => this.historyStatus.set('לא ניתן לעדכן את ההודעה כרגע.')
    });
  }

  removeMessage(msg: ContactMessage) {
    const ok = window.confirm('למחוק את ההודעה הזו?');
    if (!ok) return;
    this.api.deleteContactHistoryMessage(this.historyKey(), msg._id, msg.email).subscribe({
      next: () => {
        this.messages.update((items) => items.filter((item) => item._id !== msg._id));
        this.historyStatus.set(this.messages().length ? 'ההודעה נמחקה.' : 'אין פניות להצגה.');
      },
      error: (err) =>
        this.historyStatus.set(err?.error?.message || 'לא ניתן למחוק את ההודעה כרגע.')
    });
  }
}
