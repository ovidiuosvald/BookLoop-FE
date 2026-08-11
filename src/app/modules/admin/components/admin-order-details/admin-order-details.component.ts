import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BillingType,
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
} from 'src/app/enums/order.enums';
import { Order } from 'src/app/models/order.model';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';
import { OrderStatusDialogComponent } from '../order-status-dialog/order-status-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.scss'],
})
export class AdminOrderDetailsComponent implements OnInit {
  order?: Order;

  isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly adminService: AdminService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    if (!orderId) {
      this.commonService.showSnackBarError(
        'Comanda nu a putut fi identificată.',
      );

      this.goBack();
      return;
    }

    this.loadOrder(orderId);
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Placed:
        return 'Plasată';

      case OrderStatus.Processing:
        return 'În procesare';

      case OrderStatus.Shipped:
        return 'Expediată';

      case OrderStatus.Delivered:
        return 'Livrată';

      case OrderStatus.Cancelled:
        return 'Anulată';

      default:
        return status;
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Placed:
        return 'placed';

      case OrderStatus.Processing:
        return 'processing';

      case OrderStatus.Shipped:
        return 'shipped';

      case OrderStatus.Delivered:
        return 'delivered';

      case OrderStatus.Cancelled:
        return 'cancelled';

      default:
        return '';
    }
  }

  getPaymentMethodLabel(paymentMethod: PaymentMethod): string {
    switch (paymentMethod) {
      case PaymentMethod.Card:
        return 'Card';

      case PaymentMethod.CashOnDelivery:
        return 'Ramburs';

      case PaymentMethod.BankTransfer:
        return 'Transfer bancar';

      default:
        return paymentMethod;
    }
  }

  getDeliveryMethodLabel(deliveryMethod: DeliveryMethod): string {
    switch (deliveryMethod) {
      case DeliveryMethod.Courier:
        return 'Curier';

      case DeliveryMethod.Pickup:
        return 'Ridicare personală';

      default:
        return deliveryMethod;
    }
  }

  getBillingTypeLabel(billingType: BillingType): string {
    switch (billingType) {
      case BillingType.Individual:
        return 'Persoană fizică';

      case BillingType.Company:
        return 'Persoană juridică';

      default:
        return billingType;
    }
  }

  getImageUrl(imageUrl?: string): string {
    return this.commonService.getImageUrl(imageUrl);
  }

  canChangeStatus(status: OrderStatus): boolean {
    return status !== OrderStatus.Delivered && status !== OrderStatus.Cancelled;
  }

  openStatusDialog(): void {
    if (!this.order || !this.canChangeStatus(this.order.status)) {
      return;
    }

    const dialogRef = this.dialog.open(OrderStatusDialogComponent, {
      width: '460px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      data: {
        order: this.order,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result?: { status: OrderStatus }) => {
        if (!result || !this.order || result.status === this.order.status) {
          return;
        }

        this.updateOrderStatus(result.status);
      });
  }

  private updateOrderStatus(status: OrderStatus): void {
    if (!this.order) {
      return;
    }

    this.adminService.updateOrderStatus(this.order.orderId, status).subscribe({
      next: (updatedOrder) => {
        this.order = {
          ...this.order!,
          status: updatedOrder.status,
        };

        this.commonService.showSnackBarSuccess(
          'Statusul comenzii a fost actualizat.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Statusul comenzii nu a putut fi actualizat.',
        );
      },
    });
  }

  private loadOrder(orderId: number): void {
    this.isLoading = true;

    this.adminService.getOrderDetails(orderId).subscribe({
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
      },
    });
  }
}
