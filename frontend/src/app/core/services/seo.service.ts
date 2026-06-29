import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  setPage(opts: { title: string; description?: string }) {
    this.title.setTitle(opts.title);
    if (opts.description) {
      this.meta.updateTag({ name: 'description', content: opts.description });
    }
  }
}
