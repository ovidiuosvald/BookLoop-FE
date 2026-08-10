import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { DeliveryMethod, OrderStatus } from 'src/app/enums/order.enums';
import { Order } from 'src/app/models/order.model';
import { OrderItem } from 'src/app/models/order-item.model';
import { CommonService } from 'src/app/services/common.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss'],
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  readonly deliveryMethod = DeliveryMethod;

  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  getFirstItem(order: Order): OrderItem | undefined {
    return order.items[0];
  }

  getAdditionalItemsCount(order: Order): number {
    return Math.max(order.items.length - 1, 0);
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.Placed]: 'Plasată',
      [OrderStatus.Processing]: 'În procesare',
      [OrderStatus.Shipped]: 'Expediată',
      [OrderStatus.Delivered]: 'Livrată',
      [OrderStatus.Cancelled]: 'Anulată',
    };

    return labels[status] ?? status;
  }

  getStatusClass(status: OrderStatus): string {
    const classes: Record<OrderStatus, string> = {
      [OrderStatus.Placed]: 'placed',
      [OrderStatus.Processing]: 'processing',
      [OrderStatus.Shipped]: 'shipped',
      [OrderStatus.Delivered]: 'delivered',
      [OrderStatus.Cancelled]: 'cancelled',
    };

    return classes[status] ?? '';
  }

  getDeliveryLabel(method: DeliveryMethod): string {
    return method === DeliveryMethod.Pickup
      ? 'Ridicare din librărie'
      : 'Livrare prin curier';
  }

  getDeliveryIcon(method: DeliveryMethod): string {
    return method === DeliveryMethod.Pickup ? 'storefront' : 'local_shipping';
  }

  trackByOrderId(index: number, order: Order): number {
    return order.orderId;
  }

  getImageUrl(imageUrl?: string): string {
    return this.commonService.getImageUrl(imageUrl);
  }

  private loadOrders(): void {
    const userId = this.userService.authenticatedUser.userId;

    if (!userId) {
      this.isLoading = false;

      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    this.orderService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Comenzile nu au putut fi încărcate.',
        );
      },
    });
  }
}
