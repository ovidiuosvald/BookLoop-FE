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

// Models
import { BookFilters, BookSortOption } from 'src/app/models/book-filters.model';
import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.model';

// Services
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services/user.service';

type CatalogSortOption = 'default' | BookSortOption;

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() booksInput?: Book[];

  books: Book[] = [];
  isLoading = false;

  categories: Category[] = [];

  selectedCategoryCode?: string;
  isNewFilter = false;
  isBestsellerFilter = false;

  pageTitle = 'Toate cărțile';
  pageDescription = 'Descoperă toate cărțile disponibile în BookLoop.';

  selectedSort: CatalogSortOption = 'default';

  readonly sortOptions: {
    value: CatalogSortOption;
    label: string;
  }[] = [
    {
      value: 'default',
      label: 'Implicit',
    },
    {
      value: 'priceAsc',
      label: 'Preț crescător',
    },
    {
      value: 'priceDesc',
      label: 'Preț descrescător',
    },
    {
      value: 'titleAsc',
      label: 'Titlu A-Z',
    },
    {
      value: 'titleDesc',
      label: 'Titlu Z-A',
    },
  ];

  private currentFilters: BookFilters = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookService: BookService,
    private readonly cartService: CartService,
    private readonly commonService: CommonService,
    private readonly favoriteService: FavoriteService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  // =========================
  // LIFECYCLE
  // =========================

  ngOnInit(): void {
    if (this.booksInput !== undefined) {
      this.books = this.booksInput;
      return;
    }

    this.loadCategories();
    this.listenToQueryParams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booksInput'] && this.booksInput !== undefined) {
      this.books = this.booksInput;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // CATALOG
  // =========================

  onSortChange(): void {
    const sort = this.selectedSort === 'default' ? null : this.selectedSort;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort,
      },
      queryParamsHandling: 'merge',
    });
  }

  goToAllBooks(): void {
    this.commonService.goToAllBooks();
  }

  goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }

  trackByBookId(index: number, book: Book): number {
    return book.bookId;
  }

  // =========================
  // CART
  // =========================

  addToCart(book: Book): void {
    const userId = this.userService.authenticatedUser?.userId;

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

  // =========================
  // FAVORITES
  // =========================

  toggleFavorite(book: Book): void {
    const userId = this.userService.authenticatedUser?.userId;

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

  // =========================
  // QUERY PARAMS
  // =========================

  private listenToQueryParams(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const query = params.get('q')?.trim() || undefined;
        const categoryCode = params.get('categoryCode') || undefined;

        const isNew = params.get('isNew') === 'true' ? true : undefined;

        const isBestseller =
          params.get('isBestseller') === 'true' ? true : undefined;

        const sort = this.parseSort(params.get('sort'));

        this.selectedSort = sort ?? 'default';

        this.currentFilters = {
          q: query,
          categoryCode,
          isNew,
          isBestseller,
          sort,
        };

        this.selectedCategoryCode = categoryCode;
        this.isNewFilter = isNew ?? false;
        this.isBestsellerFilter = isBestseller ?? false;

        this.updatePageContent();
        this.loadBooks();
      });
  }

  // =========================
  // DATA
  // =========================

  private loadBooks(): void {
    this.isLoading = true;

    this.bookService.getBooks(this.currentFilters).subscribe({
      next: (books: Book[]) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.books = [];
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Cărțile nu au putut fi încărcate.',
        );
      },
    });
  }

  // =========================
  // PAGE CONTENT
  // =========================

  private updatePageContent(): void {
    const { q, categoryCode, isNew, isBestseller } = this.currentFilters;

    if (q) {
      this.pageTitle = `Rezultate pentru „${q}”`;
      this.pageDescription = 'Explorează cărțile găsite pentru căutarea ta.';

      return;
    }

    if (categoryCode) {
      this.pageTitle = this.formatCategoryTitle(categoryCode);
      this.pageDescription =
        'Explorează cărțile disponibile în această categorie.';

      return;
    }

    if (isNew) {
      this.pageTitle = 'Noutăți';
      this.pageDescription = 'Descoperă cele mai noi titluri din BookLoop.';

      return;
    }

    if (isBestseller) {
      this.pageTitle = 'Bestsellere';
      this.pageDescription = 'Descoperă cele mai apreciate cărți din BookLoop.';

      return;
    }

    this.pageTitle = 'Toate cărțile';
    this.pageDescription = 'Descoperă toate cărțile disponibile în BookLoop.';
  }

  // =========================
  // HELPERS
  // =========================

  private parseSort(sort: string | null): BookSortOption | undefined {
    switch (sort) {
      case 'priceAsc':
      case 'priceDesc':
      case 'titleAsc':
      case 'titleDesc':
        return sort;

      default:
        return undefined;
    }
  }

  private formatCategoryTitle(categoryCode: string): string {
    return categoryCode
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  selectCategory(categoryCode?: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        categoryCode: categoryCode ?? null,
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleNewFilter(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        isNew: this.isNewFilter ? true : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleBestsellerFilter(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        isBestseller: this.isBestsellerFilter ? true : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    this.router.navigate(['/books']);
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Categoriile nu au putut fi încărcate.',
        );
      },
    });
  }
}
