import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly baseUrl: string = 'http://localhost:8080/book';

  constructor(private httpClient: HttpClient) {}

  getAllBookssUsingGET(): Observable<Book[]> {
    return this.httpClient.get(`${this.baseUrl}`) as Observable<Book[]>;
  }

  getBooksByCategoryIdUsingGET(categoryId: string): Observable<Book[]> {
    return this.httpClient.get(`${this.baseUrl}/${categoryId}`) as Observable<
      Book[]
    >;
  }

  getBookByBookIdUsingGET(bookId: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.baseUrl}/id/${bookId}`);
  }

  getNewBooksUsingGET(): Observable<Book[]> {
    return this.httpClient.get(`${this.baseUrl}/new`) as Observable<Book[]>;
  }

  getBestsellersUsingGET(): Observable<Book[]> {
    return this.httpClient.get(`${this.baseUrl}/bestsellers`) as Observable<
      Book[]
    >;
  }

  createBookUsingPOST(book: Book): Observable<Book> {
    return this.httpClient.post(
      `${this.baseUrl}/create`,
      book,
    ) as Observable<Book>;
  }

  updateBookUsingPUT(book: Book): Observable<Book> {
    return this.httpClient.put(
      `${this.baseUrl}/update`,
      book,
    ) as Observable<Book>;
  }

  deleteBookUsingDELETE(bookId: string): Observable<Book> {
    return this.httpClient.delete(
      `${this.baseUrl}/delete/${bookId}`,
    ) as Observable<Book>;
  }

  getBooksByCategoryCodeUsingGET(categoryCode: string): Observable<Book[]> {
    return this.httpClient.get(
      `${this.baseUrl}/category/${categoryCode}`,
    ) as Observable<Book[]>;
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.httpClient.get<Book[]>(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}`,
    );
  }
}
