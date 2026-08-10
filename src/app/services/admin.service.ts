import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminDashboard } from '../models/admin-dashboard.model';
import { Book } from '../models/book.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/admin';

  constructor(private readonly httpClient: HttpClient) {}

  getDashboard(): Observable<AdminDashboard> {
    return this.httpClient.get<AdminDashboard>(`${this.apiUrl}/dashboard`, {
      withCredentials: true,
    });
  }

  getProducts(
    search = '',
    page = 0,
    size = 10,
    sortBy = 'bookName',
    sortDirection: 'asc' | 'desc' = 'asc',
  ): Observable<PageResponse<Book>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortBy},${sortDirection}`);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.httpClient.get<PageResponse<Book>>(`${this.apiUrl}/products`, {
      params,
      withCredentials: true,
    });
  }

  getProduct(bookId: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/products/${bookId}`, {
      withCredentials: true,
    });
  }

  createProduct(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(`${this.apiUrl}/products`, book, {
      withCredentials: true,
    });
  }

  updateProduct(bookId: number, book: Book): Observable<Book> {
    return this.httpClient.put<Book>(
      `${this.apiUrl}/products/${bookId}`,
      book,
      {
        withCredentials: true,
      },
    );
  }

  deleteProduct(bookId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/products/${bookId}`, {
      withCredentials: true,
    });
  }

  uploadProductImage(file: File, type: 'COVER' | 'PROMO'): Observable<string> {
    const formData = new FormData();

    formData.append('file', file);

    return this.httpClient.post(`${this.apiUrl}/products/image`, formData, {
      params: {
        type,
      },
      responseType: 'text',
      withCredentials: true,
    });
  }
}
