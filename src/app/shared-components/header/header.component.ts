import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';

import { Category } from 'src/app/models/category.model';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

import { AuthenticationRequiredDialogComponent } from '../authentication-required-dialog/authentication-required-dialog.component';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly isUserLoggedIn$: Observable<boolean>;

  searchTerm = '';
  categories: Category[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private categoryService: CategoryService,
  ) {
    this.isUserLoggedIn$ = this.userService.isUserLoggedIn$;
    this.getAllCategroies();
  }

  getAllCategroies(): void {
    this.categoryService.getAllCategoriesUsingGET().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Eroare la obținerea categoriilor:', err);
      },
    });
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
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.userService.logoutUsingPOST();
        }
      });
  }

  private openAuthenticationRequiredDialog(): void {
    this.dialog.open(AuthenticationRequiredDialogComponent, {
      width: '620px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      panelClass: 'authentication-required-dialog-panel',
    });
  }
}
