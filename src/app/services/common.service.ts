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
  private readonly backendUrl = 'http://localhost:8080';

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  // =========================
  // NOTIFICATIONS
  // =========================

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

  // =========================
  // STORE NAVIGATION
  // =========================

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  goToAllBooks(): void {
    this.router.navigate(['/books']);
  }

  goToBooks(category: Category): void {
    this.router.navigate(['/books'], {
      queryParams: {
        categoryCode: category.categoryCode,
      },
    });
  }

  goToBestsellers(): void {
    this.router.navigate(['/books'], {
      queryParams: {
        isBestseller: true,
      },
    });
  }

  goToNewBooks(): void {
    this.router.navigate(['/books'], {
      queryParams: {
        isNew: true,
      },
    });
  }

  goToSearch(query: string): void {
    this.router.navigate(['/books'], {
      queryParams: {
        q: query.trim(),
      },
    });
  }

  goToSpecificBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // =========================
  // AUTH NAVIGATION
  // =========================

  goToLoginPage(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegisterPage(): void {
    this.router.navigate(['/auth/register']);
  }

  // =========================
  // ACCOUNT NAVIGATION
  // =========================

  goToProfile(): void {
    this.router.navigate(['/account/profile']);
  }

  goToAddresses(): void {
    this.router.navigate(['/account/addresses']);
  }

  goToOrders(): void {
    this.router.navigate(['/account/orders']);
  }

  goToFavorites(): void {
    this.router.navigate(['/account/favorites']);
  }

  // =========================
  // ADMIN NAVIGATION
  // =========================

  goToAdminPage(): void {
    this.router.navigate(['/admin']);
  }

  goToAdminDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goToAdminProducts(): void {
    this.router.navigate(['/admin/products']);
  }

  // =========================
  // INFORMATION PAGES
  // =========================

  goToTermsAndConditions(): void {
    this.router.navigate(['/info/terms-and-conditions']);
  }

  goToPrivacyPolicy(): void {
    this.router.navigate(['/info/privacy-policy']);
  }

  goToDeliveryAndReturns(): void {
    this.router.navigate(['/info/delivery-and-returns']);
  }

  // =========================
  // IMAGE HELPERS
  // =========================

  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) {
      return '';
    }

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('data:')
    ) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/uploads/')) {
      return `${this.backendUrl}${imageUrl}`;
    }

    return imageUrl;
  }

  // =========================
  // PRIVATE HELPERS
  // =========================

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
}
