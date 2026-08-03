import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = 'http://localhost:8080/cart';

  constructor(private readonly httpClient: HttpClient) {}

  getCart(userId: number): Observable<Cart> {
    return this.httpClient.get<Cart>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

  addBook(userId: number, bookId: number): Observable<Cart> {
    return this.httpClient.post<Cart>(
      `${this.apiUrl}/add/${userId}/${bookId}`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  updateQuantity(
    userId: number,
    bookId: number,
    quantity: number,
  ): Observable<Cart> {
    return this.httpClient.put<Cart>(
      `${this.apiUrl}/update/${userId}/${bookId}?quantity=${quantity}`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  removeBook(userId: number, bookId: number): Observable<Cart> {
    return this.httpClient.delete<Cart>(
      `${this.apiUrl}/remove/${userId}/${bookId}`,
      {
        withCredentials: true,
      },
    );
  }

  clearCart(userId: number): Observable<Cart> {
    return this.httpClient.delete<Cart>(`${this.apiUrl}/clear/${userId}`, {
      withCredentials: true,
    });
  }

  moveToFavorites(userId: number, bookId: number): Observable<Cart> {
    return this.httpClient.post<Cart>(
      `${this.apiUrl}/move-to-favorites/${userId}/${bookId}`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
