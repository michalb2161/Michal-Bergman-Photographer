import { Component, inject, input, output } from '@angular/core';
import { ImageAsset } from '../../../core/models/portfolio.models';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { ImageLikeService } from '../../../core/services/image-like.service';

@Component({
  selector: 'app-masonry-grid',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <div class="masonry">
      @for (img of images(); track img._id; let i = $index) {
        <div
          class="tile"
          role="button"
          tabindex="0"
          (click)="selected.emit(img)"
          (keydown.enter)="selected.emit(img)"
          (keydown.space)="selected.emit(img)"
          appFadeIn
          [appFadeInDelay]="i * 40"
        >
          <img [src]="api.absoluteMedia(img.thumbUrl || img.url)" [alt]="img.alt || img.title || 'תמונה'" loading="lazy" />
          <div class="shine"></div>
          <button
            type="button"
            class="like"
            [class.liked]="likes.isLiked(img._id)"
            (click)="toggleLike($event, img)"
            [attr.aria-label]="likes.isLiked(img._id) ? 'ביטול לייק' : 'הוספת לייק'"
          >
            {{ likes.isLiked(img._id) ? '♥' : '♡' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .masonry {
      column-count: 3;
      column-gap: 0.85rem;
    }
    @media (max-width: 1024px) {
      .masonry {
        column-count: 2;
      }
    }
    @media (max-width: 600px) {
      .masonry {
        column-count: 1;
      }
    }
    .tile {
      break-inside: avoid;
      margin-bottom: 0.85rem;
      border: none;
      padding: 0;
      border-radius: var(--lux-radius-md);
      overflow: hidden;
      cursor: zoom-in;
      position: relative;
      background: var(--lux-surface-mid);
      display: block;
      width: 100%;
    }
    img {
      width: 100%;
      height: auto;
      transform: scale(1.001);
      transition: transform 0.8s ease;
    }
    .tile:hover img {
      transform: scale(1.05);
    }
    .like {
      position: absolute;
      inset-inline-end: 0.65rem;
      bottom: 0.65rem;
      z-index: 3;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: #111;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: inherit;
      font-size: 2rem;
      font-weight: 600;
      line-height: 1;
      width: 2.35rem;
      height: 2.35rem;
      padding: 0;
      text-shadow: 0 1px 4px rgba(255, 255, 255, 0.75);
    }
    .like.liked {
      color: #111;
    }
    .shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.18), transparent 70%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }
    .tile:hover .shine {
      opacity: 1;
    }
  `
})
export class MasonryGridComponent {
  readonly api = inject(PortfolioApiService);
  readonly likes = inject(ImageLikeService);
  readonly images = input<ImageAsset[]>([]);
  readonly selected = output<ImageAsset>();

  toggleLike(event: MouseEvent, img: ImageAsset) {
    event.stopPropagation();
    this.likes.toggle(img._id).subscribe({
      next: (res) => {
        img.likeCount = res.data.likeCount;
      }
    });
  }
}
