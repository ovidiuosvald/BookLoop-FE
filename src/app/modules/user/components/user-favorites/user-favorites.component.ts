import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { CommonService } from 'src/app/services/common.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss'],
})
export class UserFavoritesComponent implements OnInit {
  public favoriteBooks: Book[] = [];
  public isLoading = true;

  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadFavoriteBooks();
  }

  private loadFavoriteBooks(): void {
    const userId = this.userService.authenticatedUser.userId;

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
        console.error('Eroare favorite:', error);

        this.isLoading = false;

        const message =
          typeof error.error === 'string' ? error.error : error.error?.message;

        this.commonService.showSnackBarError(
          message || 'Cărțile favorite nu au putut fi încărcate.',
        );
      },
    });
  }

  public goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }

  public addToCart(book: Book): void {
    console.log(`${book.bookName} adăugat în coș.`);
  }

  public removeFromFavorites(book: Book): void {
    const userId = this.userService.authenticatedUser.userId;

    if (!userId) {
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
      error: () => {
        this.commonService.showSnackBarError(
          'Cartea nu a putut fi eliminată din favorite.',
        );
      },
    });
  }
}
