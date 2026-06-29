import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/portfolio.models';

/** שירות מוצרים — get / post / patch / delete מול ה-API (כפי שמופיע בהוראות הפרויקט). */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  getAllProducts(visibleOnly = true): Observable<Product[]> {
    const q = visibleOnly ? '?visible=true' : '';
    return this.http.get<{ success: boolean; data: Product[] }>(`${this.apiUrl}${q}`).pipe(map((r) => r.data || []));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.apiUrl}/${id}`).pipe(map((r) => r.data));
  }

  addProduct(body: Partial<Product> & { title: string }): Observable<Product> {
    return this.http.post<{ success: boolean; data: Product }>(this.apiUrl, body).pipe(map((r) => r.data));
  }

  updateProduct(id: string, body: Partial<Product>): Observable<Product> {
    return this.http.patch<{ success: boolean; data: Product }>(`${this.apiUrl}/${id}`, body).pipe(map((r) => r.data));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }
}
