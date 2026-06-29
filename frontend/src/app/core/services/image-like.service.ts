import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PortfolioApiService } from './portfolio-api.service';

const LIKED_IMAGES_KEY = 'michal_liked_images';

@Injectable({ providedIn: 'root' })
export class ImageLikeService {
  private readonly api = inject(PortfolioApiService);
  private readonly likedIds = signal<Set<string>>(this.readLiked());

  isLiked(id: string): boolean {
    return this.likedIds().has(id);
  }

  toggle(id: string): Observable<{ success: boolean; data: { _id: string; likeCount: number; liked: boolean } }> {
    const nextLiked = !this.isLiked(id);
    return this.api.toggleImageLike(id, nextLiked).pipe(
      tap(() => {
        const liked = new Set(this.likedIds());
        if (nextLiked) liked.add(id);
        else liked.delete(id);
        this.likedIds.set(liked);
        this.writeLiked(liked);
      })
    );
  }

  private readLiked(): Set<string> {
    if (typeof localStorage === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(LIKED_IMAGES_KEY);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(ids);
    } catch {
      return new Set();
    }
  }

  private writeLiked(ids: Set<string>) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LIKED_IMAGES_KEY, JSON.stringify([...ids]));
  }
}
