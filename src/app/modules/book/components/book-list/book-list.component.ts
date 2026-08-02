import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.model';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from 'src/app/services/common.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnChanges {
  @Input() booksInput: Book[] = [];

  categoryCode!: string;
  books: Book[] = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly router: Router,
    private readonly favoriteService: FavoriteService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.booksInput.length > 0) {
      this.books = this.booksInput;
      return;
    }

    this.route.paramMap.subscribe((params) => {
      const navigation = this.router.getCurrentNavigation();

      const isBestseller =
        navigation?.extras.state?.isBestseller ?? history.state.isBestseller;

      const categoryCode = params.get('categoryCode');

      if (isBestseller) {
        this.loadBestsellers();
        return;
      }

      if (categoryCode) {
        this.categoryCode = categoryCode;
        this.loadBooksByCategoryCode(categoryCode);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booksInput']) {
      this.books = this.booksInput;
    }
  }

  loadBestsellers(): void {
    this.bookService.getBestsellersUsingGET().subscribe({
      next: (books: Book[]) => {
        this.books = books;
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Bestsellerele nu au putut fi încărcate.',
        );
      },
    });
  }

  loadBooksByCategoryCode(categoryCode: string): void {
    this.bookService.getBooksByCategoryCodeUsingGET(categoryCode).subscribe({
      next: (books: Book[]) => {
        this.books = books;
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Cărțile nu au putut fi încărcate.',
        );
      },
    });
  }

  addToCart(book: Book): void {
    console.log(`${book.bookName} adăugat în coș.`);
  }

  goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }

  toggleFavorite(book: Book): void {
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

  getCategoryName(category: string | Category): string {
    return typeof category === 'string' ? category : category.categoryName;
  }
}
