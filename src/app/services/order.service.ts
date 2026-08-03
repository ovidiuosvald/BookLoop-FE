import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';
import { PlaceOrderRequest } from '../models/place-order-request.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080/order';

  constructor(private readonly httpClient: HttpClient) {}

  placeOrder(userId: number, request: PlaceOrderRequest): Observable<Order> {
    return this.httpClient.post<Order>(
      `${this.apiUrl}/place/${userId}`,
      request,
      {
        withCredentials: true,
      },
    );
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

  getOrderDetails(userId: number, orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(
      `${this.apiUrl}/user/${userId}/${orderId}`,
      {
        withCredentials: true,
      },
    );
  }
}
