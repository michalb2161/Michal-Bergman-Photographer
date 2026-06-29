import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';

interface Msg {
  _id: string;
  username?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-admin-messages-page',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  template: `
    <h1>הודעות יצירת קשר</h1>
    <table mat-table [dataSource]="items()" class="mat-elevation-z1">
      <ng-container matColumnDef="username">
        <th mat-header-cell *matHeaderCellDef>שם משתמש</th>
        <td mat-cell *matCellDef="let m">{{ m.username || '-' }}</td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>שם</th>
        <td mat-cell *matCellDef="let m">{{ m.name }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>אימייל</th>
        <td mat-cell *matCellDef="let m">{{ m.email }}</td>
      </ng-container>
      <ng-container matColumnDef="message">
        <th mat-header-cell *matHeaderCellDef>הודעה</th>
        <td mat-cell *matCellDef="let m">{{ truncate(m.message) }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let m">
          <button mat-button type="button" (click)="mark(m)">סמן נקרא</button>
          <button mat-button color="warn" type="button" (click)="remove(m)">מחיקה</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: `
    h1 {
      margin-top: 0;
    }
    table {
      width: 100%;
    }
  `
})
export class AdminMessagesPageComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  readonly items = signal<Msg[]>([]);
  columns = ['username', 'name', 'email', 'message', 'actions'];

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.adminMessages().subscribe((res) => this.items.set((res.data as Msg[]) || []));
  }

  mark(m: Msg) {
    this.api.markMessageRead(m._id).subscribe(() => this.reload());
  }

  remove(m: Msg) {
    this.api.deleteMessage(m._id).subscribe(() => this.reload());
  }

  truncate(text: string) {
    if (!text) return '';
    return text.length > 90 ? text.slice(0, 90) + '…' : text;
  }
}
