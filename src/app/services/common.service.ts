import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Category } from '../models/category.model';
import {
  NotificationData,
  NotificationType,
} from '../models/notification.model';
import { NotificationComponent } from '../shared-components/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  // notification methods
  showSnackBarSuccess(message: string): void {
    this.showNotification(message, 'success');
  }

  showSnackBarError(message: string): void {
    this.showNotification(message, 'error');
  }

  showSnackBarInfo(message: string): void {
    this.showNotification(message, 'info');
  }

  showSnackBarWarning(message: string): void {
    this.showNotification(message, 'warning');
  }

  showHttpError(error: HttpErrorResponse, fallbackMessage: string): void {
    const message =
      typeof error.error === 'string' ? error.error : error.error?.message;

    this.showSnackBarError(message || fallbackMessage);
  }

  private showNotification(message: string, type: NotificationType): void {
    const data: NotificationData = {
      message,
      type,
    };

    this.snackBar.openFromComponent(NotificationComponent, {
      data,
      duration: type === 'error' ? 6000 : 4500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['bookloop-notification-panel'],
    });
  }

  // navigation methods
  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  goToBooks(category: Category): void {
    this.router.navigate(['/books', category.categoryCode]);
  }

  goToSpecificBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToLoginPage(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegisterPage(): void {
    this.router.navigate(['/auth/register']);
  }

  goToBestsellers(): void {
    this.router.navigate(['/books/bestsellere'], {
      state: {
        isBestseller: true,
      },
    });
  }

  goToSearch(query: string): void {
    this.router.navigate(['/search'], {
      queryParams: {
        q: query,
      },
    });
  }

  goToProfile(): void {
    this.router.navigate(['/account/profile']);
  }

  goToOrders(): void {
    this.router.navigate(['/account/orders']);
  }

  goToFavorites(): void {
    this.router.navigate(['/account/favorites']);
  }

  goToReviews(): void {
    this.router.navigate(['/account/reviews']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
