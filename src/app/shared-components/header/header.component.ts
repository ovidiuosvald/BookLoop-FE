import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';

import { Category } from 'src/app/models/category.model';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

import { AuthenticationRequiredDialogComponent } from '../authentication-required-dialog/authentication-required-dialog.component';
import { CategoryService } from 'src/app/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly isUserLoggedIn$: Observable<boolean>;

  searchTerm = '';
  categories: Category[] = [];

  get isAdmin(): boolean {
    return this.userService.authenticatedUser?.role === 'ADMIN';
  }

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private categoryService: CategoryService,
  ) {
    this.isUserLoggedIn$ = this.userService.isUserLoggedIn$;
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Eroare la obținerea categoriilor:', error);
      },
    });
  }

  goToAdminDashboard(): void {
    this.commonService.goToAdminDashboard();
  }

  goToHomePage(): void {
    this.commonService.goToHomePage();
  }

  goToBooks(category: Category): void {
    this.commonService.goToBooks(category);
  }

  goToBestsellers(): void {
    this.commonService.goToBestsellers();
  }

  goToOffers(): void {
    // Temporar, până ai o rută sau o metodă dedicată pentru oferte.
    this.commonService.showSnackBarError(
      'Pagina de oferte nu este disponibilă momentan.',
    );
  }

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

  goToLogin(): void {
    this.commonService.goToLoginPage();
  }

  goToRegister(): void {
    this.commonService.goToRegisterPage();
  }

  goToProfile(): void {
    this.commonService.goToProfile();
  }

  goToOrders(): void {
    this.commonService.goToOrders();
  }

  goToFavorites(): void {
    this.commonService.goToFavorites();
  }

  goToReviews(): void {
    this.commonService.goToReviews();
  }

  goToCart(): void {
    this.commonService.goToCart();
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
        if (confirmed) {
          this.userService.logout();
        }
      });
  }

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
