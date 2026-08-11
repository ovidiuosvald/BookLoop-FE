import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, take, takeUntil } from 'rxjs';

// Models
import { Category } from 'src/app/models/category.model';

// Services
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

// Components
import { AuthenticationRequiredDialogComponent } from '../authentication-required-dialog/authentication-required-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly isUserLoggedIn$: Observable<boolean>;
  readonly cartItemCount$: Observable<number>;

  searchTerm = '';
  categories: Category[] = [];

  private readonly destroy$ = new Subject<void>();

  get isAdmin(): boolean {
    return this.userService.authenticatedUser?.role === 'ADMIN';
  }

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly categoryService: CategoryService,
    private readonly commonService: CommonService,
  ) {
    this.isUserLoggedIn$ = this.userService.isUserLoggedIn$;

    this.cartItemCount$ = this.cartService.cartItemCount$;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.listenToAuthenticationChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // STORE NAVIGATION
  // =========================

  goToHomePage(): void {
    this.commonService.goToHomePage();
  }

  goToAllBooks(): void {
    this.commonService.goToAllBooks();
  }

  goToBooks(category: Category): void {
    this.commonService.goToBooks(category);
  }

  goToBestsellers(): void {
    this.commonService.goToBestsellers();
  }

  goToCart(): void {
    this.commonService.goToCart();
  }

  // =========================
  // SEARCH
  // =========================

  onSearch(): void {
    const query = this.searchTerm.trim();

    if (!query) {
      return;
    }

    this.commonService.goToSearch(query);
  }

  clearSearch(): void {
    this.searchTerm = '';

    this.commonService.goToHomePage();
  }

  // =========================
  // AUTH / ACCOUNT
  // =========================

  goToLogin(): void {
    this.commonService.goToLoginPage();
  }

  goToRegister(): void {
    this.commonService.goToRegisterPage();
  }

  goToProfile(): void {
    this.commonService.goToProfile();
  }

  goToAddresses(): void {
    this.commonService.goToAddresses();
  }

  goToOrders(): void {
    this.commonService.goToOrders();
  }

  goToFavorites(): void {
    this.commonService.goToFavorites();
  }

  onFavoritesClick(): void {
    this.isUserLoggedIn$.pipe(take(1)).subscribe((isUserLoggedIn: boolean) => {
      if (isUserLoggedIn) {
        this.goToFavorites();
        return;
      }

      this.openAuthenticationRequiredDialog();
    });
  }

  // =========================
  // ADMIN
  // =========================

  goToAdminDashboard(): void {
    this.commonService.goToAdminDashboard();
  }

  // =========================
  // LOGOUT
  // =========================

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirmation-dialog-panel',
      data: {
        title: 'Delogare',
        message: 'Sigur dorești să te deloghezi din cont?',
        confirmText: 'Delogare',
        cancelText: 'Anulează',
        confirmIcon: 'logout',
        type: 'danger',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) {
          return;
        }

        this.cartService.resetCartCount();
        this.userService.logout();
      });
  }

  // =========================
  // DATA
  // =========================

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

  private listenToAuthenticationChanges(): void {
    this.isUserLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isUserLoggedIn: boolean) => {
        if (!isUserLoggedIn) {
          this.cartService.resetCartCount();
          return;
        }

        const userId = this.userService.authenticatedUser?.userId;

        if (!userId) {
          return;
        }

        this.cartService
          .getCart(userId)
          .pipe(take(1))
          .subscribe({
            error: () => {
              this.cartService.resetCartCount();
            },
          });
      });
  }

  // =========================
  // DIALOGS
  // =========================

  private openAuthenticationRequiredDialog(): void {
    this.dialog.open(AuthenticationRequiredDialogComponent, {
      width: '620px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      panelClass: 'authentication-required-dialog-panel',
    });
  }
}
