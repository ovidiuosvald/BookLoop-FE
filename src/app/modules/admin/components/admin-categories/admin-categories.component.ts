import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];

  isLoading = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly categoryService: CategoryService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '480px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      panelClass: 'category-dialog-panel',
      data: {},
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result?: { categoryName: string }) => {
        if (!result) {
          return;
        }

        this.createCategory(result.categoryName);
      });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '480px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      panelClass: 'category-dialog-panel',
      data: {
        category,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result?: { categoryName: string }) => {
        if (!result) {
          return;
        }

        this.updateCategory(category, result.categoryName);
      });
  }

  openDeleteDialog(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '440px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      panelClass: 'confirmation-dialog-panel',
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

  private createCategory(categoryName: string): void {
    const category: Category = {
      categoryId: '',
      categoryName,
      categoryCode: '',
    };

    this.categoryService.createCategory(category).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess('Categoria a fost adăugată.');

        this.loadCategories();
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Categoria nu a putut fi adăugată.',
        );
      },
    });
  }

  private updateCategory(category: Category, categoryName: string): void {
    const updatedCategory: Category = {
      ...category,
      categoryName,
    };

    this.categoryService.updateCategory(updatedCategory).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess('Categoria a fost actualizată.');

        this.loadCategories();
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Categoria nu a putut fi actualizată.',
        );
      },
    });
  }

  private deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category.categoryId).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess('Categoria a fost ștearsă.');

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

    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
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
