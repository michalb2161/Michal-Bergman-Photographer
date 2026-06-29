import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { Category, ImageAsset } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-admin-images-page',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatSelectModule, MatFormFieldModule, FormsModule],
  template: `
    <h1>ניהול תמונות</h1>
    <div
      class="drop"
      (dragover)="$event.preventDefault()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      role="button"
      tabindex="0"
    >
      גררו לכאן תמונות או לחצו לבחירה (עד 12)
      <input #fileInput type="file" multiple hidden (change)="onPick($event)" accept="image/*" />
    </div>
    <div class="row">
      <mat-form-field appearance="outline">
        <mat-label>קטגוריה</mat-label>
        <mat-select [(ngModel)]="categoryId">
          <mat-option value="">ללא</mat-option>
          @for (c of categories(); track c._id) {
            <mat-option [value]="c._id">{{ c.nameHe }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <button mat-flat-button color="primary" type="button" (click)="fileInput.click()">העלאה</button>
    </div>
    <table mat-table [dataSource]="images()" class="mat-elevation-z1">
      <ng-container matColumnDef="thumb">
        <th mat-header-cell *matHeaderCellDef>תצוגה</th>
        <td mat-cell *matCellDef="let img">
          <img class="thumb" [src]="api.absoluteMedia(img.thumbUrl || img.url)" alt="" />
        </td>
      </ng-container>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>כותרת</th>
        <td mat-cell *matCellDef="let img">{{ img.title }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let img">
          <button mat-button color="warn" type="button" (click)="remove(img)">מחיקה</button>
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
    .drop {
      border: 1px dashed rgba(0, 0, 0, 0.35);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      margin-bottom: 1rem;
      background: rgba(255, 255, 255, 0.6);
    }
    .row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .thumb {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 8px;
    }
    table {
      width: 100%;
    }
  `
})
export class AdminImagesPageComponent implements OnInit {
  readonly api = inject(PortfolioApiService);
  readonly images = signal<ImageAsset[]>([]);
  readonly categories = signal<Category[]>([]);
  categoryId = '';
  columns = ['thumb', 'title', 'actions'];

  ngOnInit() {
    this.reload();
    this.api.adminCategories().subscribe((res) => this.categories.set(res.data || []));
  }

  reload() {
    this.api.getImages({ page: 1, limit: 200 }).subscribe((res) => this.images.set(res.data || []));
  }

  uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    if (this.categoryId) fd.append('category', this.categoryId);
    this.api.uploadImages(fd).subscribe(() => this.reload());
  }

  onPick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.uploadFiles(input.files);
    input.value = '';
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer?.files) this.uploadFiles(ev.dataTransfer.files);
  }

  remove(img: ImageAsset) {
    this.api.deleteImage(img._id).subscribe(() => this.reload());
  }
}
