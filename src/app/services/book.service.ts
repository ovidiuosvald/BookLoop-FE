import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = 'http://localhost:8080/book';

  constructor(private readonly httpClient: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.apiUrl);
  }

  getBook(bookId: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/id/${bookId}`);
  }

  getBooksByCategory(categoryCode: string): Observable<Book[]> {
    return this.httpClient.get<Book[]>(
      `${this.apiUrl}/category/${categoryCode}`,
    );
  }

  getNewBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/new`);
  }

  getBestsellers(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/bestsellers`);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.httpClient.get<Book[]>(
      `${this.apiUrl}/search?q=${encodeURIComponent(query)}`,
    );
  }

  createBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(`${this.apiUrl}/create`, book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiUrl}/update`, book);
  }

  deleteBook(bookId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/delete/${bookId}`);
  }
}
