import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = 'http://localhost:8080/cart';

  private readonly cartItemCountSubject = new BehaviorSubject<number>(0);

  readonly cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  getCart(userId: number): Observable<Cart> {
    return this.httpClient
      .get<Cart>(`${this.apiUrl}/user/${userId}`, {
        withCredentials: true,
      })
      .pipe(tap((cart: Cart) => this.updateCartCount(cart)));
  }

  addBook(userId: number, bookId: number): Observable<Cart> {
    return this.httpClient
      .post<Cart>(
        `${this.apiUrl}/add/${userId}/${bookId}`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(tap((cart: Cart) => this.updateCartCount(cart)));
  }

  updateQuantity(
    userId: number,
    bookId: number,
    quantity: number,
  ): Observable<Cart> {
    return this.httpClient
      .put<Cart>(
        `${this.apiUrl}/update/${userId}/${bookId}`,
        {},
        {
          params: {
            quantity,
          },
          withCredentials: true,
        },
      )
      .pipe(tap((cart: Cart) => this.updateCartCount(cart)));
  }

  removeBook(userId: number, bookId: number): Observable<Cart> {
    return this.httpClient
      .delete<Cart>(`${this.apiUrl}/remove/${userId}/${bookId}`, {
        withCredentials: true,
      })
      .pipe(tap((cart: Cart) => this.updateCartCount(cart)));
  }

  clearCart(userId: number): Observable<Cart> {
    return this.httpClient
      .delete<Cart>(`${this.apiUrl}/clear/${userId}`, {
        withCredentials: true,
      })
      .pipe(tap((cart: Cart) => this.updateCartCount(cart)));
  }

  moveToFavorites(userId: number, bookId: number): Observable<Cart> {
    return this.httpClient
      .post<Cart>(
        `${this.apiUrl}/move-to-favorites/${userId}/${bookId}`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(tap((cart: Cart) => this.updateCartCount(cart)));
  }

  resetCartCount(): void {
    this.cartItemCountSubject.next(0);
  }

  private updateCartCount(cart: Cart): void {
    this.cartItemCountSubject.next(cart.totalItems ?? 0);
  }
}
