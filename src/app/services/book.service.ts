import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book.model';
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

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.apiUrl, {
      params: this.getUserParams(),
      withCredentials: true,
    });
  }

  getBook(bookId: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/id/${bookId}`, {
      params: this.getUserParams(),
      withCredentials: true,
    });
  }

  getBooksByCategory(categoryCode: string): Observable<Book[]> {
    return this.httpClient.get<Book[]>(
      `${this.apiUrl}/category/${categoryCode}`,
      {
        params: this.getUserParams(),
        withCredentials: true,
      },
    );
  }

  getNewBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/new`, {
      params: this.getUserParams(),
      withCredentials: true,
    });
  }

  getBestsellers(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/bestsellers`, {
      params: this.getUserParams(),
      withCredentials: true,
    });
  }

  searchBooks(query: string): Observable<Book[]> {
    let params = new HttpParams().set('q', query.trim());

    const userId = this.userService.authenticatedUser.userId;

    if (userId) {
      params = params.set('userId', userId);
    }

    return this.httpClient.get<Book[]>(`${this.apiUrl}/search`, {
      params,
      withCredentials: true,
    });
  }

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

  private getUserParams(): HttpParams {
    const userId = this.userService.authenticatedUser.userId;

    if (!userId) {
      return new HttpParams();
    }

    return new HttpParams().set('userId', userId);
  }
}
