import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ImageAsset } from '../../../core/models/portfolio.models';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';

export interface ImageLightboxData {
  image: ImageAsset;
}

@Component({
  selector: 'app-image-lightbox-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="wrap">
      <button mat-icon-button class="close" (click)="close()" aria-label="סגור">✕</button>
      <img [src]="api.absoluteMedia(data.image.url)" [alt]="data.image.alt || data.image.title || ''" />
      @if (data.image.title || data.image.description) {
        <div class="caption">
          <strong>{{ data.image.title }}</strong>
          <p>{{ data.image.description }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    .wrap {
      position: relative;
      max-width: min(96vw, 1200px);
      background: var(--lux-footer-bg);
      color: var(--lux-footer-text);
    }
    img {
      width: 100%;
      max-height: min(86vh, 900px);
      object-fit: contain;
      display: block;
    }
    .close {
      position: absolute;
      top: 8px;
      inset-inline-start: 8px;
      color: #fff;
      background: rgba(0, 0, 0, 0.35);
    }
    .caption {
      padding: 0.9rem 1rem 1.1rem;
      border-top: 1px solid rgba(246, 241, 232, 0.12);
    }
    p {
      margin: 0.35rem 0 0;
      color: var(--lux-footer-muted);
      line-height: 1.6;
    }
  `
})
export class ImageLightboxDialogComponent {
  readonly ref = inject(MatDialogRef<ImageLightboxDialogComponent>);
  readonly data = inject<ImageLightboxData>(MAT_DIALOG_DATA);
  readonly api = inject(PortfolioApiService);

  close() {
    this.ref.close();
  }
}
