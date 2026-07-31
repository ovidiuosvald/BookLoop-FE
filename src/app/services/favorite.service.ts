import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly baseUrl = 'http://localhost:8080/favorite';

  constructor(private httpClient: HttpClient) {}

  public toggleFavorite(userId: number, book: Book): Observable<boolean> {
    if (book.isFavorite) {
      return this.removeFavorite(userId, book.bookId).pipe(map(() => false));
    }

    return this.addFavorite(userId, book.bookId).pipe(map(() => true));
  }

  public getUserFavorites(userId: number): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.baseUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

  public addFavorite(userId: number, bookId: number): Observable<unknown> {
    return this.httpClient.post(`${this.baseUrl}/create/${userId}/${bookId}`, {
      withCredentials: true,
    });
  }

  public removeFavorite(userId: number, bookId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/delete/${userId}/${bookId}`,
      {
        withCredentials: true,
      },
    );
  }
}
