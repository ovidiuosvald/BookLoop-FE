import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  showSnackBarSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['green-snackbar'],
    });
  }

  showSnackBarError(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['red-snackbar'],
    });
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  goToBooks(category: Category): void {
    this.router.navigate(['/books', category.categoryCode]);
  }

  goToSpecificBook(bookId: string): void {
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

  goToCheckout(): void {
    this.router.navigate(['/cart/checkout']);
  }

  goToBestsellers(): void {
    this.router.navigate(['/books/bestsellere'], {
      state: { isBestseller: true },
    });
  }

  goToSearch(query: string): void {
    this.router.navigate(['/search'], {
      queryParams: { q: query },
    });
  }

  goToProfile(): void {
    this.router.navigate(['/account/details']);
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
}
