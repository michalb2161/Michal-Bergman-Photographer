import { Component, inject, input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageAsset } from '../../../core/models/portfolio.models';
import { MasonryGridComponent } from '../masonry-grid/masonry-grid.component';
import { ImageLightboxDialogComponent } from '../image-lightbox/image-lightbox-dialog.component';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [MasonryGridComponent, MatDialogModule],
  template: `<app-masonry-grid [images]="images()" (selected)="open($event)" />`
})
export class ImageGalleryComponent {
  private readonly dialog = inject(MatDialog);
  readonly images = input<ImageAsset[]>([]);

  open(img: ImageAsset) {
    this.dialog.open(ImageLightboxDialogComponent, {
      data: { image: img },
      panelClass: 'lux-dialog',
      maxWidth: '96vw'
    });
  }
}
