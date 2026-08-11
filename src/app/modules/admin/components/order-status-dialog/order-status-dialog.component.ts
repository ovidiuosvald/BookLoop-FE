import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderStatus } from 'src/app/enums/order.enums';
import { AdminOrder } from 'src/app/models/admin-order.model';

@Component({
  selector: 'app-order-status-dialog',
  templateUrl: './order-status-dialog.component.html',
  styleUrls: ['./order-status-dialog.component.scss'],
})
export class OrderStatusDialogComponent implements OnInit {
  statusForm!: FormGroup;

  availableStatuses: Array<{
    value: OrderStatus;
    label: string;
  }> = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<OrderStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      order: AdminOrder;
    },
  ) {}

  ngOnInit(): void {
    this.availableStatuses = this.getAvailableStatuses(this.data.order.status);

    this.statusForm = this.formBuilder.group({
      status: [this.availableStatuses[0]?.value ?? null, Validators.required],
    });
  }

  get currentStatusLabel(): string {
    return this.getStatusLabel(this.data.order.status);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      status: this.statusForm.getRawValue().status as OrderStatus,
    });
  }

  private getAvailableStatuses(currentStatus: OrderStatus): Array<{
    value: OrderStatus;
    label: string;
  }> {
    if (
      currentStatus === OrderStatus.Delivered ||
      currentStatus === OrderStatus.Cancelled
    ) {
      return [];
    }

    const statuses = [
      {
        value: OrderStatus.Placed,
        label: 'Plasată',
      },
      {
        value: OrderStatus.Processing,
        label: 'În procesare',
      },
      {
        value: OrderStatus.Shipped,
        label: 'Expediată',
      },
      {
        value: OrderStatus.Delivered,
        label: 'Livrată',
      },
      {
        value: OrderStatus.Cancelled,
        label: 'Anulată',
      },
    ];

    return statuses.filter((status) => status.value !== currentStatus);
  }

  private getStatusLabel(status: OrderStatus): string {
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
}
