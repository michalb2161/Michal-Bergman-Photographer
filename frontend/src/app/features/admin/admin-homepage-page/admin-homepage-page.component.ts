import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { HomepageSection } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-admin-homepage-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  template: `
    <h1>דף הבית — Hero</h1>
    <form [formGroup]="heroForm" (ngSubmit)="saveHero()" class="block">
      <mat-form-field appearance="outline" class="full">
        <mat-label>כותרת</mat-label>
        <input matInput formControlName="title" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full">
        <mat-label>תת כותרת</mat-label>
        <textarea matInput rows="2" formControlName="subtitle"></textarea>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full">
        <mat-label>תמונת רקע (URL)</mat-label>
        <input matInput formControlName="imageUrl" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>טקסט כפתור</mat-label>
        <input matInput formControlName="ctaLabel" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>קישור כפתור</mat-label>
        <input matInput formControlName="ctaHref" />
      </mat-form-field>
      <mat-slide-toggle formControlName="visible">גלוי</mat-slide-toggle>
      <button mat-flat-button color="primary" type="submit">שמירה</button>
    </form>
  `,
  styles: `
    h1 {
      margin-top: 0;
    }
    .block {
      display: grid;
      gap: 0.75rem;
    }
    .full {
      width: 100%;
    }
  `
})
export class AdminHomepagePageComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly fb = inject(FormBuilder);
  readonly sections = signal<HomepageSection[]>([]);

  readonly heroForm = this.fb.nonNullable.group({
    sectionKey: ['hero'],
    title: ['', Validators.required],
    subtitle: [''],
    imageUrl: [''],
    ctaLabel: [''],
    ctaHref: [''],
    visible: [true]
  });

  ngOnInit() {
    this.api.adminHomepage().subscribe((res) => {
      const list = res.data || [];
      this.sections.set(list);
      const hero = list.find((s) => s.sectionKey === 'hero');
      if (hero) {
        this.heroForm.patchValue({
          title: hero.title || '',
          subtitle: hero.subtitle || '',
          imageUrl: hero.imageUrl || '',
          ctaLabel: hero.ctaLabel || '',
          ctaHref: hero.ctaHref || '',
          visible: !!hero.visible
        });
      }
    });
  }

  saveHero() {
    if (this.heroForm.invalid) return;
    this.api.upsertHomepage(this.heroForm.getRawValue()).subscribe();
  }
}
