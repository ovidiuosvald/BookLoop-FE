import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  showSnackBarSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['green-snackbar'],
    });
  }
  showSnackBarError(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['red-snackbar'],
    });
  }

  goToHomePage() {
    this.router.navigate(['']);
  }

  goToBooks(category: Category) {
    this.router.navigate(['/books', category.categoryCode]);
  }

  goToSpecificBook(bookId: string) {
    this.router.navigate([`/book/${bookId}`]);
  }

  goToCart() {
    this.router.navigate([`/cart`]);
  }

  goToLoginPage() {
    this.router.navigate(['/auth/login']);
  }

  goToRegisterPage() {
    this.router.navigate(['/auth/register']);
  }

  gotToCheckout() {
    this.router.navigate(['cart/checkout']);
  }

  goToBestsellers() {
    this.router.navigate(['/books/bestsellere'], {
      state: { isBestseller: true },
    });
  }
}
