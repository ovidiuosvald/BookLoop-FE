import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.model';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from 'src/app/services/common.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  public book?: Book;
  public isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly favoriteService: FavoriteService,
  ) {}

  ngOnInit(): void {
    this.loadBook();
  }

  private loadBook(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.isLoading = false;

      this.commonService.showSnackBarError(
        'Cartea nu a putut fi identificată.',
      );
      return;
    }

    this.bookService.getBook(Number(id)).subscribe({
      next: (book: Book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;

        this.commonService.showSnackBarError(
          'Detaliile cărții nu au putut fi încărcate.',
        );
      },
    });
  }

  public toggleFavorite(book: Book): void {
    const userId = this.userService.authenticatedUser.userId;

    if (!userId) {
      this.commonService.showSnackBarError(
        'Trebuie să fii autentificat pentru a salva cărți la favorite.',
      );
      return;
    }

    this.favoriteService.toggleFavorite(userId, book).subscribe({
      next: (isFavorite: boolean) => {
        book.isFavorite = isFavorite;

        this.commonService.showSnackBarSuccess(
          isFavorite
            ? 'Cartea a fost adăugată la favorite.'
            : 'Cartea a fost eliminată din favorite.',
        );
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Favoritele nu au putut fi actualizate.',
        );
      },
    });
  }

  public addToCart(): void {
    if (!this.book) {
      return;
    }

    console.log(`${this.book.bookName} a fost adăugată în coș.`);
  }

  public getCategoryName(category: string | Category): string {
    return typeof category === 'string' ? category : category.categoryName;
  }
}
