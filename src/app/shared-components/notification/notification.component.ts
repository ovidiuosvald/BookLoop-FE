import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import {
  NotificationData,
  NotificationType,
} from 'src/app/models/notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public readonly data: NotificationData,
    private readonly snackBarRef: MatSnackBarRef<NotificationComponent>,
  ) {}

  get icon(): string {
    const icons: Record<NotificationType, string> = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
      warning: 'warning',
    };

    return icons[this.data.type];
  }

  close(): void {
    this.snackBarRef.dismiss();
  }
}
