import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Enums
import { OrderStatus } from '../enums/order.enums';
import { UserRole } from '../enums/user-role.enum';

// Models
import { AdminDashboard } from '../models/admin-dashboard.model';
import { AdminOrder } from '../models/admin-order.model';
import { Book } from '../models/book.model';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { PageResponse } from '../models/page-response.model';
import { UserInterface } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/admin';

  constructor(private readonly httpClient: HttpClient) {}

  // =========================
  // DASHBOARD
  // =========================

  getDashboard(): Observable<AdminDashboard> {
    return this.httpClient.get<AdminDashboard>(`${this.apiUrl}/dashboard`, {
      withCredentials: true,
    });
  }

  // =========================
  // PRODUCTS
  // =========================

  getProducts(
    search = '',
    lowStock?: boolean,
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

    if (lowStock) {
      params = params.set('lowStock', true);
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

  // =========================
  // CATEGORIES
  // =========================

  getCategories(
    page = 0,
    size = 10,
    sortBy = 'categoryName',
    sortDirection: 'asc' | 'desc' = 'asc',
  ): Observable<PageResponse<Category>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortBy},${sortDirection}`);

    return this.httpClient.get<PageResponse<Category>>(
      `${this.apiUrl}/categories`,
      {
        params,
        withCredentials: true,
      },
    );
  }

  // =========================
  // ORDERS
  // =========================

  getOrders(
    search = '',
    status?: OrderStatus,
    page = 0,
    size = 10,
    sortBy = 'creationDate',
    sortDirection: 'asc' | 'desc' = 'desc',
  ): Observable<PageResponse<AdminOrder>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortBy},${sortDirection}`);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.httpClient.get<PageResponse<AdminOrder>>(
      `${this.apiUrl}/orders`,
      {
        params,
        withCredentials: true,
      },
    );
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.apiUrl}/orders/${orderId}`, {
      withCredentials: true,
    });
  }

  updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Observable<AdminOrder> {
    return this.httpClient.put<AdminOrder>(
      `${this.apiUrl}/orders/${orderId}/status`,
      {
        status,
      },
      {
        withCredentials: true,
      },
    );
  }

  // =========================
  // USERS
  // =========================

  getUsers(
    search = '',
    page = 0,
    size = 10,
    sortBy = 'firstName',
    sortDirection: 'asc' | 'desc' = 'asc',
  ): Observable<PageResponse<UserInterface>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortBy},${sortDirection}`);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.httpClient.get<PageResponse<UserInterface>>(
      `${this.apiUrl}/users`,
      {
        params,
        withCredentials: true,
      },
    );
  }

  updateUserRole(userId: number, role: UserRole): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.apiUrl}/users/${userId}/role`,
      {
        role,
      },
      {
        withCredentials: true,
      },
    );
  }
}
