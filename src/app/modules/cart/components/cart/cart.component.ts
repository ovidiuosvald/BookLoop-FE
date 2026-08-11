import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// Models
import { Cart } from 'src/app/models/cart.model';

// Services
import { CartService } from 'src/app/services/cart.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart?: Cart;
  isLoading = true;

  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // =========================
  // NAVIGATION
  // =========================

  nextStep(): void {
    this.commonService.goToCheckout();
  }

  goToHomePage(): void {
    this.commonService.goToHomePage();
  }

  // =========================
  // CART ACTIONS
  // =========================

  removeBook(bookId: number): void {
    const userId = this.getUserId();

    if (!userId) {
      return;
    }

    this.cartService.removeBook(userId, bookId).subscribe({
      next: (cart: Cart) => {
        this.cart = cart;

        this.commonService.showSnackBarSuccess(
          'Cartea a fost eliminată din coș.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Cartea nu a putut fi eliminată din coș.',
        );
      },
    });
  }

  updateQuantity(event: { bookId: number; quantity: number }): void {
    const userId = this.getUserId();

    if (!userId) {
      return;
    }

    this.cartService
      .updateQuantity(userId, event.bookId, event.quantity)
      .subscribe({
        next: (cart: Cart) => {
          this.cart = cart;

          this.commonService.showSnackBarSuccess(
            'Cantitatea a fost actualizată.',
          );
        },
        error: (error: HttpErrorResponse) => {
          this.commonService.showHttpError(
            error,
            'Cantitatea nu a putut fi actualizată.',
          );
        },
      });
  }

  moveToFavorites(bookId: number): void {
    const userId = this.getUserId();

    if (!userId) {
      return;
    }

    this.cartService.moveToFavorites(userId, bookId).subscribe({
      next: (cart: Cart) => {
        this.cart = cart;

        this.commonService.showSnackBarSuccess(
          'Cartea a fost mutată la favorite.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Cartea nu a putut fi mutată la favorite.',
        );
      },
    });
  }

  // =========================
  // DATA
  // =========================

  private loadCart(): void {
    const userId = this.getUserId();

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.cartService.getCart(userId).subscribe({
      next: (cart: Cart) => {
        this.cart = cart;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Coșul nu a putut fi încărcat.',
        );
      },
    });
  }

  private getUserId(): number | undefined {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );
    }

    return userId;
  }
}
