import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { DialogBoxConfirmationComponent } from '../dialog-box-confirmation/dialog-box-confirmation.component';
import { CommonService } from 'src/app/services/common.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm = '';
  authenticatedUser$: Observable<string>;
  categories: Category[] = [];

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly categoryService: CategoryService,
  ) {
    this.authenticatedUser$ = this.userService.authenticatedUser$.pipe(
      map((user) => `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()),
    );

    this.getAllCategories();
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        map((value) => value.trim()),
        debounceTime(400),
        distinctUntilChanged(),
        filter((value) => value.length >= 2),
        takeUntil(this.destroy$),
      )
      .subscribe((query) => {
        this.commonService.goToSearch(query);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;

    if (!value.trim()) {
      this.clearSearch();
      return;
    }

    this.searchSubject.next(value);
  }

  onSearch(): void {
    const query = this.searchTerm.trim();

    if (query.length < 2) {
      return;
    }

    this.commonService.goToSearch(query);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.commonService.goToHomePage();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategoriesUsingGET().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Eroare la obținerea categoriilor:', error);
      },
    });
  }

  goToHomePage(): void {
    this.commonService.goToHomePage();
  }

  goToBooks(category: Category): void {
    this.commonService.goToBooks(category);
  }

  goToCart(): void {
    this.commonService.goToCart();
  }

  goToBestsellers(): void {
    this.commonService.goToBestsellers();
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

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(DialogBoxConfirmationComponent, {
      data: {
        message: 'Are you sure you want to log out?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.userService.logoutUsingPOST();
      }
    });
  }
}
