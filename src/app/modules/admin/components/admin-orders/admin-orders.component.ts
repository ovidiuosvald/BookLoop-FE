import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// Enums
import { OrderStatus } from 'src/app/enums/order.enums';

// Models
import { AdminOrder } from 'src/app/models/admin-order.model';
import { PageResponse } from 'src/app/models/page-response.model';

// Services
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';

// Components
import { OrderStatusDialogComponent } from '../order-status-dialog/order-status-dialog.component';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  orders: AdminOrder[] = [];

  displayedColumns: string[] = [
    'orderId',
    'customerName',
    'totalPrice',
    'status',
    'creationDate',
    'lastModifiedDate',
    'actions',
  ];

  readonly orderStatuses: OrderStatus[] = [
    OrderStatus.Placed,
    OrderStatus.Processing,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
  ];

  searchControl = new FormControl('');

  statusFilter?: OrderStatus;

  isLoading = true;

  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  readonly pageSizeOptions = [5, 10, 20, 50];

  sortBy = 'creationDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly adminService: AdminService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    const status = this.route.snapshot.queryParamMap.get('status');

    if (status) {
      this.statusFilter = status as OrderStatus;
    }

    this.listenToSearchChanges();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setStatusFilter(status?: OrderStatus): void {
    this.statusFilter = status;
    this.pageIndex = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: status ?? null,
      },
      queryParamsHandling: 'merge',
    });

    this.loadOrders();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadOrders();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sortBy = 'creationDate';
      this.sortDirection = 'desc';
    } else {
      this.sortBy = sort.active;
      this.sortDirection = sort.direction === 'desc' ? 'desc' : 'asc';
    }

    this.pageIndex = 0;

    this.loadOrders();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  openOrderDetails(order: AdminOrder): void {
    this.router.navigate(['/admin/orders', order.orderId]);
  }

  openStatusDialog(order: AdminOrder): void {
    if (!this.canChangeStatus(order.status)) {
      return;
    }

    const dialogRef = this.dialog.open(OrderStatusDialogComponent, {
      width: '460px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      data: {
        order,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result?: { status: OrderStatus }) => {
        if (!result || result.status === order.status) {
          return;
        }

        this.updateOrderStatus(order, result.status);
      });
  }

  canChangeStatus(status: OrderStatus): boolean {
    return status !== OrderStatus.Delivered && status !== OrderStatus.Cancelled;
  }

  getStatusTooltip(status: OrderStatus): string {
    if (!this.canChangeStatus(status)) {
      return 'Statusul unei comenzi livrate sau anulate nu mai poate fi modificat.';
    }

    return 'Modifică statusul';
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

  trackByOrderId(index: number, order: AdminOrder): number {
    return order.orderId;
  }

  private updateOrderStatus(order: AdminOrder, status: OrderStatus): void {
    this.adminService.updateOrderStatus(order.orderId, status).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess(
          'Statusul comenzii a fost actualizat.',
        );

        this.loadOrders();
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Statusul comenzii nu a putut fi actualizat.',
        );
      },
    });
  }

  private listenToSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadOrders();
      });
  }

  private loadOrders(): void {
    this.isLoading = true;

    this.adminService
      .getOrders(
        this.searchControl.value ?? '',
        this.statusFilter,
        this.pageIndex,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
      )
      .subscribe({
        next: (response: PageResponse<AdminOrder>) => {
          this.orders = response.content;
          this.totalElements = response.totalElements;

          this.pageIndex = response.number;
          this.pageSize = response.size;

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
