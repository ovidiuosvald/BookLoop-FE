import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly apiUrl = 'http://localhost:8080/favorite';

  constructor(private readonly httpClient: HttpClient) {}

  getFavorites(userId: number): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

  toggleFavorite(userId: number, book: Book): Observable<boolean> {
    if (book.isFavorite) {
      return this.removeFavorite(userId, book.bookId).pipe(map(() => false));
    }

    return this.addFavorite(userId, book.bookId).pipe(map(() => true));
  }

  addFavorite(userId: number, bookId: number): Observable<void> {
    return this.httpClient.post<void>(
      `${this.apiUrl}/create/${userId}/${bookId}`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  removeFavorite(userId: number, bookId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiUrl}/delete/${userId}/${bookId}`,
      {
        withCredentials: true,
      },
    );
  }
}
