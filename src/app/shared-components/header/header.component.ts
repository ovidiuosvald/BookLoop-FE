import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationRequiredDialogComponent } from '../authentication-required-dialog/authentication-required-dialog.component';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { Category } from 'src/app/models/category.model';

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
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
  ) {
    this.isUserLoggedIn$ = this.userService.isUserLoggedIn$;
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  goToBooks(category: Category): void {
    this.router.navigate(['/product'], {
      queryParams: {
        category: category.categoryName,
      },
    });
  }

  goToBestsellers(): void {
    this.router.navigate(['/product'], {
      queryParams: {
        bestseller: true,
      },
    });
  }

  goToOffers(): void {
    this.router.navigate(['/product'], {
      queryParams: {
        offers: true,
      },
    });
  }

  onSearch(): void {
    const value = this.searchTerm.trim();

    if (!value) {
      return;
    }

    this.router.navigate(['/product'], {
      queryParams: {
        search: value,
      },
    });
  }

  clearSearch(): void {
    this.searchTerm = '';

    this.router.navigate(['/product'], {
      queryParams: {
        search: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToProfile(): void {
    this.router.navigate(['/user/profile']);
  }

  goToOrders(): void {
    this.router.navigate(['/user/orders']);
  }

  goToFavorites(): void {
    this.router.navigate(['/user/favorites']);
  }

  goToReviews(): void {
    this.router.navigate(['/user/reviews']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
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
