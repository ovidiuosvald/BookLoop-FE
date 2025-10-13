import { ChangePasswordComponent } from './../../modules/authentication/components/change-password/change-password.component';
import { map, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { DialogBoxConfirmationComponent } from '../dialog-box-confirmation/dialog-box-confirmation.component';
import { CommonService } from 'src/app/services/common.service';
import { UpdateUsernameComponent } from 'src/app/modules/authentication/components/update-username/update-username.component';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  searchTerm: string = '';
  authenticatedUser$: Observable<string>;
  categories: Category[] = [];

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private commonService: CommonService,
    private categoryService: CategoryService
  ) {
    this.authenticatedUser$ = this.userService.authenticatedUser$.pipe(
      map((user) => user.username!)
    );
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

  goToHomePage() {
    this.commonService.goToHomePage();
  }

  goToBooks(category: Category) {
    this.commonService.goToBooks(category);
  }

  goToCart() {
    this.commonService.goToCart();
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(DialogBoxConfirmationComponent, {
      data: { message: 'Are you sure you want to log out?' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'yes') {
        this.userService.logoutUsingPOST();
      }
    });
  }

  openUpdateUsernameDialog() {
    this.dialog.open(UpdateUsernameComponent);
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent);
  }

  goToBestsellers() {
    this.commonService.goToBestsellers();
  }
}
