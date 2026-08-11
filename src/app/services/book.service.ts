import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { Book } from '../models/book.model';
import { BookFilters } from '../models/book-filters.model';

// Services
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = 'http://localhost:8080/book';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly userService: UserService,
  ) {}

  // =========================
  // CATALOG
  // =========================

  getBooks(filters: BookFilters = {}): Observable<Book[]> {
    const params = this.buildCatalogParams(filters);

    return this.httpClient.get<Book[]>(this.apiUrl, {
      params,
      withCredentials: true,
    });
  }

  // =========================
  // BOOK DETAILS
  // =========================

  getBook(bookId: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/id/${bookId}`, {
      params: this.getUserParams(),
      withCredentials: true,
    });
  }

  // =========================
  // BOOK MANAGEMENT
  // =========================

  createBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(`${this.apiUrl}/create`, book, {
      withCredentials: true,
    });
  }

  updateBook(book: Book): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiUrl}/update`, book, {
      withCredentials: true,
    });
  }

  deleteBook(bookId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/delete/${bookId}`, {
      withCredentials: true,
    });
  }

  // =========================
  // PARAMS
  // =========================

  private buildCatalogParams(filters: BookFilters): HttpParams {
    let params = this.getUserParams();

    const query = filters.q?.trim();

    if (query) {
      params = params.set('q', query);
    }

    if (filters.categoryCode) {
      params = params.set('categoryCode', filters.categoryCode);
    }

    if (filters.isNew !== undefined) {
      params = params.set('isNew', filters.isNew);
    }

    if (filters.isBestseller !== undefined) {
      params = params.set('isBestseller', filters.isBestseller);
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return params;
  }

  private getUserParams(): HttpParams {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      return new HttpParams();
    }

    return new HttpParams().set('userId', userId);
  }
}
