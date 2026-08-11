import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// Models
import { Book } from 'src/app/models/book.model';

// Services
import { CartService } from 'src/app/services/cart.service';
import { CommonService } from 'src/app/services/common.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss'],
})
export class UserFavoritesComponent implements OnInit {
  favoriteBooks: Book[] = [];
  isLoading = true;

  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadFavoriteBooks();
  }

  // =========================
  // NAVIGATION
  // =========================

  goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }

  // =========================
  // CART
  // =========================

  addToCart(book: Book): void {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    this.cartService.addBook(userId, book.bookId).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess(
          'Cartea a fost adăugată în coș.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Cartea nu a putut fi adăugată în coș.',
        );
      },
    });
  }

  // =========================
  // FAVORITES
  // =========================

  removeFromFavorites(book: Book): void {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    this.favoriteService.removeFavorite(userId, book.bookId).subscribe({
      next: () => {
        this.favoriteBooks = this.favoriteBooks.filter(
          (favoriteBook) => favoriteBook.bookId !== book.bookId,
        );

        this.commonService.showSnackBarSuccess(
          'Cartea a fost eliminată din favorite.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Cartea nu a putut fi eliminată din favorite.',
        );
      },
    });
  }

  // =========================
  // HELPERS
  // =========================

  getImageUrl(imageUrl?: string): string {
    return this.commonService.getImageUrl(imageUrl);
  }

  trackByBookId(index: number, book: Book): number {
    return book.bookId;
  }

  // =========================
  // DATA
  // =========================

  private loadFavoriteBooks(): void {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      this.isLoading = false;

      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    this.favoriteService.getFavorites(userId).subscribe({
      next: (books: Book[]) => {
        this.favoriteBooks = books;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Cărțile favorite nu au putut fi încărcate.',
        );
      },
    });
  }
}
