import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { Category } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-admin-categories-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h1>קטגוריות</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>שם בעברית</mat-label>
        <input matInput formControlName="nameHe" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Slug</mat-label>
        <input matInput formControlName="slug" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="wide">
        <mat-label>תיאור</mat-label>
        <textarea matInput rows="2" formControlName="description"></textarea>
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">שמירה</button>
    </form>
    <table mat-table [dataSource]="items()" class="mat-elevation-z1">
      <ng-container matColumnDef="nameHe">
        <th mat-header-cell *matHeaderCellDef>שם</th>
        <td mat-cell *matCellDef="let c">{{ c.nameHe }}</td>
      </ng-container>
      <ng-container matColumnDef="slug">
        <th mat-header-cell *matHeaderCellDef>Slug</th>
        <td mat-cell *matCellDef="let c">{{ c.slug }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let c">
          <button mat-button type="button" (click)="edit(c)">עריכה</button>
          <button mat-button color="warn" type="button" (click)="remove(c)">מחיקה</button>
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
    .form {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
      align-items: center;
    }
    .wide {
      flex: 1 1 220px;
    }
    table {
      width: 100%;
    }
  `
})
export class AdminCategoriesPageComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Category[]>([]);
  columns = ['nameHe', 'slug', 'actions'];

  readonly form = this.fb.nonNullable.group({
    _id: [''],
    nameHe: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.adminCategories().subscribe((res) => this.items.set(res.data || []));
  }

  save() {
    const v = this.form.getRawValue();
    this.api.saveCategory(v as Category).subscribe(() => {
      this.form.reset({ _id: '', nameHe: '', slug: '', description: '' });
      this.reload();
    });
  }

  edit(c: Category) {
    this.form.patchValue({
      _id: c._id,
      nameHe: c.nameHe,
      slug: c.slug,
      description: c.description || ''
    });
  }

  remove(c: Category) {
    this.api.deleteCategory(c._id).subscribe(() => this.reload());
  }
}
