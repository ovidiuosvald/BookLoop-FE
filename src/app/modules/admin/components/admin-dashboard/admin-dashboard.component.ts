import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { OrderStatus } from 'src/app/enums/order.enums';
import { AdminDashboard } from 'src/app/models/admin-dashboard.model';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  dashboard?: AdminDashboard;

  isLoading = true;

  constructor(
    private readonly adminService: AdminService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
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

  private loadDashboard(): void {
    this.isLoading = true;

    this.adminService.getDashboard().subscribe({
      next: (dashboard: AdminDashboard) => {
        this.dashboard = dashboard;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Datele dashboard-ului nu au putut fi încărcate.',
        );
      },
    });
  }
}
