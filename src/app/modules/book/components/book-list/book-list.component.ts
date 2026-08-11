import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { CommonService } from 'src/app/services/common.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

type BookSortOption =
  | 'default'
  | 'priceAsc'
  | 'priceDesc'
  | 'titleAsc'
  | 'titleDesc';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() booksInput?: Book[];

  books: Book[] = [];

  pageTitle = 'Toate cărțile';
  pageDescription = 'Descoperă toate cărțile disponibile în BookLoop.';

  selectedSort: BookSortOption = 'default';

  readonly sortOptions = [
    {
      value: 'default' as BookSortOption,
      label: 'Implicit',
    },
    {
      value: 'priceAsc' as BookSortOption,
      label: 'Preț crescător',
    },
    {
      value: 'priceDesc' as BookSortOption,
      label: 'Preț descrescător',
    },
    {
      value: 'titleAsc' as BookSortOption,
      label: 'Titlu A-Z',
    },
    {
      value: 'titleDesc' as BookSortOption,
      label: 'Titlu Z-A',
    },
  ];

  private originalBooks: Book[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly commonService: CommonService,
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly router: Router,
    private readonly favoriteService: FavoriteService,
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  ngOnInit(): void {
    if (this.booksInput !== undefined) {
      this.setBooks(this.booksInput);
      return;
    }

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const navigation = this.router.getCurrentNavigation();

      const isBestseller =
        navigation?.extras.state?.isBestseller ?? history.state.isBestseller;

      const categoryCode = params.get('categoryCode');

      if (isBestseller) {
        this.pageTitle = 'Bestsellere';
        this.pageDescription =
          'Descoperă cele mai apreciate cărți din BookLoop.';

        this.loadBestsellers();
        return;
      }

      if (categoryCode) {
        this.pageTitle = this.formatCategoryTitle(categoryCode);

        this.pageDescription =
          'Explorează cărțile disponibile în această categorie.';

        this.loadBooksByCategoryCode(categoryCode);

        return;
      }

      this.pageTitle = 'Toate cărțile';
      this.pageDescription = 'Descoperă toate cărțile disponibile în BookLoop.';

      this.loadAllBooks();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booksInput'] && this.booksInput !== undefined) {
      this.setBooks(this.booksInput);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSortChange(): void {
    this.applySorting();
  }

  addToCart(book: Book): void {
    const userId = this.userService.authenticatedUser.userId;

    if (!userId) {
      this.commonService.showSnackBarError(
        'Trebuie să fii autentificat pentru a adăuga cărți în coș.',
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

  goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }

  goToAllBooks(): void {
    this.commonService.goToAllBooks();
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

  trackByBookId(index: number, book: Book): number {
    return book.bookId;
  }

  private loadAllBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.setBooks(books);
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Cărțile nu au putut fi încărcate.',
        );
      },
    });
  }

  private loadBestsellers(): void {
    this.bookService.getBestsellers().subscribe({
      next: (books: Book[]) => {
        this.setBooks(books);
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Bestsellerele nu au putut fi încărcate.',
        );
      },
    });
  }

  private loadBooksByCategoryCode(categoryCode: string): void {
    this.bookService.getBooksByCategory(categoryCode).subscribe({
      next: (books: Book[]) => {
        this.setBooks(books);
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Cărțile nu au putut fi încărcate.',
        );
      },
    });
  }

  private setBooks(books: Book[]): void {
    this.originalBooks = [...books];
    this.books = [...books];

    this.applySorting();
  }

  private applySorting(): void {
    const sortedBooks = [...this.originalBooks];

    switch (this.selectedSort) {
      case 'priceAsc':
        sortedBooks.sort((a, b) => a.currentPrice - b.currentPrice);
        break;

      case 'priceDesc':
        sortedBooks.sort((a, b) => b.currentPrice - a.currentPrice);
        break;

      case 'titleAsc':
        sortedBooks.sort((a, b) => a.bookName.localeCompare(b.bookName, 'ro'));
        break;

      case 'titleDesc':
        sortedBooks.sort((a, b) => b.bookName.localeCompare(a.bookName, 'ro'));
        break;

      default:
        break;
    }

    this.books = sortedBooks;
  }

  private formatCategoryTitle(categoryCode: string): string {
    return categoryCode
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
