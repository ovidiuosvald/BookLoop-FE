import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Enums
import {
  BillingType,
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
} from 'src/app/enums/order.enums';

// Models
import { OrderItem } from 'src/app/models/order-item.model';
import { Order } from 'src/app/models/order.model';

// Services
import { CommonService } from 'src/app/services/common.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order?: Order;
  isLoading = true;

  readonly billingType = BillingType;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  // =========================
  // NAVIGATION
  // =========================

  goBack(): void {
    this.router.navigate(['/account/orders']);
  }

  goToBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId, this.router.url);
  }

  // =========================
  // ORDER ITEMS
  // =========================

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  trackByOrderItem(index: number, item: OrderItem): number {
    return item.bookId;
  }

  // =========================
  // STATUS
  // =========================

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

  // =========================
  // DELIVERY
  // =========================

  getDeliveryLabel(method: DeliveryMethod): string {
    return method === DeliveryMethod.Pickup
      ? 'Ridicare din librărie'
      : 'Livrare prin curier';
  }

  getDeliveryIcon(method: DeliveryMethod): string {
    return method === DeliveryMethod.Pickup ? 'storefront' : 'local_shipping';
  }

  // =========================
  // PAYMENT / BILLING
  // =========================

  getPaymentLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.CashOnDelivery]: 'Plată ramburs',
      [PaymentMethod.Card]: 'Card bancar',
      [PaymentMethod.BankTransfer]: 'Transfer bancar',
    };

    return labels[method] ?? method;
  }

  getBillingLabel(type: BillingType): string {
    return type === BillingType.Company
      ? 'Persoană juridică'
      : 'Persoană fizică';
  }

  // =========================
  // HELPERS
  // =========================

  getImageUrl(imageUrl?: string): string {
    return this.commonService.getImageUrl(imageUrl);
  }

  // =========================
  // DATA
  // =========================

  private loadOrderDetails(): void {
    const userId = this.userService.authenticatedUser?.userId;

    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    if (!userId) {
      this.isLoading = false;

      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    if (!orderId || Number.isNaN(orderId)) {
      this.isLoading = false;

      this.commonService.showSnackBarError('Comanda selectată nu este validă.');

      this.router.navigate(['/account/orders']);

      return;
    }

    this.orderService.getOrderDetails(userId, orderId).subscribe({
      next: (order: Order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Detaliile comenzii nu au putut fi încărcate.',
        );

        this.router.navigate(['/account/orders']);
      },
    });
  }
}
