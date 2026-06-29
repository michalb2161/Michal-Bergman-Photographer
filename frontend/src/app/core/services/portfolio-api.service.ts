import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiListResponse,
  Category,
  ContactMessage,
  ContactPayload,
  HomepageSection,
  ImageAsset,
  Testimonial
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  absoluteMedia(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const origin = environment.apiOrigin.replace(/\/$/, '');
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  }

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(`${this.base}/categories`);
  }

  getImages(params: { page?: number; limit?: number; category?: string; featured?: boolean }) {
    let hp = new HttpParams();
    if (params.page) hp = hp.set('page', String(params.page));
    if (params.limit) hp = hp.set('limit', String(params.limit));
    if (params.category) hp = hp.set('category', params.category);
    if (params.featured) hp = hp.set('featured', 'true');
    return this.http.get<ApiListResponse<ImageAsset>>(`${this.base}/images`, { params: hp });
  }

  toggleImageLike(id: string, liked: boolean) {
    return this.http.post<{ success: boolean; data: { _id: string; likeCount: number; liked: boolean } }>(
      `${this.base}/images/${id}/like`,
      { liked }
    );
  }

  getTestimonials() {
    return this.http.get<{ success: boolean; data: Testimonial[] }>(
      `${this.base}/testimonials/public`
    );
  }

  getHomepageSections() {
    return this.http.get<{ success: boolean; data: HomepageSection[] }>(
      `${this.base}/homepage-sections/public`
    );
  }

  sendContact(body: ContactPayload) {
    return this.http.post<{
      success: boolean;
      data?: { id?: string; username?: string };
      email?: { sent: boolean; reason?: string; error?: string };
    }>(`${this.base}/contact`, body);
  }

  getContactHistory(username: string) {
    const clean = encodeURIComponent(username.trim().toLowerCase());
    return this.http.get<{ success: boolean; data: ContactMessage[] }>(
      `${this.base}/contact/history/${clean}`
    );
  }

  updateContactHistoryMessage(username: string, id: string, message: string, email?: string) {
    const clean = encodeURIComponent(username.trim().toLowerCase());
    return this.http.patch<{ success: boolean; data: ContactMessage }>(
      `${this.base}/contact/history/${clean}/${id}`,
      { message, email }
    );
  }

  deleteContactHistoryMessage(username: string, id: string, email?: string) {
    let hp = new HttpParams();
    if (username) hp = hp.set('username', username.trim().toLowerCase());
    if (email) hp = hp.set('email', email);
    return this.http.delete<{ success: boolean }>(`${this.base}/contact/public/${id}`, {
      params: hp
    });
  }

  adminStats() {
    return this.http.get<{ success: boolean; data: Record<string, number> }>(`${this.base}/admin/stats`);
  }

  adminCategories() {
    return this.http.get<{ success: boolean; data: Category[] }>(`${this.base}/categories`);
  }

  saveCategory(cat: Partial<Category> & { nameHe: string; slug: string }) {
    if (cat._id) {
      const { _id, ...body } = cat as Category;
      return this.http.patch<{ success: boolean; data: Category }>(`${this.base}/categories/${_id}`, body);
    }
    return this.http.post<{ success: boolean; data: Category }>(`${this.base}/categories`, cat);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.base}/categories/${id}`);
  }

  adminTestimonials() {
    return this.http.get<{ success: boolean; data: Testimonial[] }>(`${this.base}/testimonials`);
  }

  saveTestimonial(t: Partial<Testimonial>) {
    if (t._id) {
      return this.http.patch(`${this.base}/testimonials/${t._id}`, t);
    }
    return this.http.post(`${this.base}/testimonials`, t);
  }

  deleteTestimonial(id: string) {
    return this.http.delete(`${this.base}/testimonials/${id}`);
  }

  adminHomepage() {
    return this.http.get<{ success: boolean; data: HomepageSection[] }>(`${this.base}/homepage-sections`);
  }

  upsertHomepage(section: Partial<HomepageSection> & { sectionKey: string }) {
    return this.http.put<{ success: boolean; data: HomepageSection }>(
      `${this.base}/homepage-sections/upsert`,
      section
    );
  }

  adminMessages() {
    return this.http.get<{ success: boolean; data: unknown[] }>(`${this.base}/contact`);
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.base}/contact/${id}`);
  }

  markMessageRead(id: string) {
    return this.http.patch(`${this.base}/contact/${id}/read`, {});
  }

  uploadImages(formData: FormData) {
    return this.http.post<{ success: boolean; data: ImageAsset[] }>(`${this.base}/images`, formData);
  }

  updateImage(id: string, body: Partial<ImageAsset>) {
    return this.http.patch<{ success: boolean; data: ImageAsset }>(`${this.base}/images/${id}`, body);
  }

  deleteImage(id: string) {
    return this.http.delete(`${this.base}/images/${id}`);
  }
}
