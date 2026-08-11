import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { take } from 'rxjs';

import { Category } from 'src/app/models/category.model';
import { PageResponse } from 'src/app/models/page-response.model';
import { AdminService } from 'src/app/services/admin.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];

  isLoading = true;

  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  sortBy = 'categoryName';
  sortDirection: 'asc' | 'desc' = 'asc';

  readonly pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private readonly dialog: MatDialog,
    private readonly adminService: AdminService,
    private readonly categoryService: CategoryService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadCategories();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sortBy = 'categoryName';
      this.sortDirection = 'asc';
    } else {
      this.sortBy = sort.active;
      this.sortDirection = sort.direction === 'desc' ? 'desc' : 'asc';
    }

    this.pageIndex = 0;

    this.loadCategories();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '460px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      data: {
        mode: 'create',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((categoryName?: string) => {
        if (!categoryName) {
          return;
        }

        const category: Category = {
          categoryId: '',
          categoryName,
          categoryCode: '',
        };

        this.categoryService.createCategory(category).subscribe({
          next: () => {
            this.commonService.showSnackBarSuccess(
              'Categoria a fost adăugată.',
            );

            this.pageIndex = 0;
            this.loadCategories();
          },
          error: (error: HttpErrorResponse) => {
            this.commonService.showHttpError(
              error,
              'Categoria nu a putut fi adăugată.',
            );
          },
        });
      });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '460px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      data: {
        mode: 'edit',
        category,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((categoryName?: string) => {
        if (!categoryName) {
          return;
        }

        const updatedCategory: Category = {
          ...category,
          categoryName,
        };

        this.categoryService.updateCategory(updatedCategory).subscribe({
          next: () => {
            this.commonService.showSnackBarSuccess(
              'Categoria a fost actualizată.',
            );

            this.loadCategories();
          },
          error: (error: HttpErrorResponse) => {
            this.commonService.showHttpError(
              error,
              'Categoria nu a putut fi actualizată.',
            );
          },
        });
      });
  }

  openDeleteDialog(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '440px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      data: {
        title: 'Șterge categoria',
        message: `Sigur dorești să ștergi categoria „${category.categoryName}”?`,
        confirmText: 'Șterge',
        cancelText: 'Anulează',
        confirmIcon: 'delete_outline',
        type: 'danger',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.deleteCategory(category);
        }
      });
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.categoryId;
  }

  private deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category.categoryId).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess('Categoria a fost ștearsă.');

        if (this.categories.length === 1 && this.pageIndex > 0) {
          this.pageIndex--;
        }

        this.loadCategories();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.commonService.showSnackBarError(
            'Categoria nu poate fi ștearsă deoarece există cărți asociate acesteia.',
          );

          return;
        }

        this.commonService.showHttpError(
          error,
          'Categoria nu a putut fi ștearsă.',
        );
      },
    });
  }

  private loadCategories(): void {
    this.isLoading = true;

    this.adminService
      .getCategories(
        this.pageIndex,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
      )
      .subscribe({
        next: (response: PageResponse<Category>) => {
          this.categories = response.content;
          this.totalElements = response.totalElements;

          this.pageIndex = response.number;
          this.pageSize = response.size;

          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;

          this.commonService.showHttpError(
            error,
            'Categoriile nu au putut fi încărcate.',
          );
        },
      });
  }
}
