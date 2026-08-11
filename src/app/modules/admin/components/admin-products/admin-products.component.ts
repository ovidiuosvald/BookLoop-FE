import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Book } from 'src/app/models/book.model';
import { PageResponse } from 'src/app/models/page-response.model';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Book[] = [];

  searchControl = new FormControl('');

  isLoading = true;

  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  sortBy = 'bookName';
  sortDirection: 'asc' | 'desc' = 'asc';

  readonly pageSizeOptions = [5, 10, 20, 50];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly adminService: AdminService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.listenToSearchChanges();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadProducts();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sortBy = 'bookName';
      this.sortDirection = 'asc';
    } else {
      this.sortBy = sort.active;
      this.sortDirection = sort.direction === 'desc' ? 'desc' : 'asc';
    }

    this.pageIndex = 0;

    this.loadProducts();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  getCategoryName(product: Book): string {
    if (typeof product.category === 'string') {
      return product.category;
    }

    return product.category?.categoryName ?? '-';
  }

  getStockClass(quantity: number): string {
    if (quantity === 0) {
      return 'out-of-stock';
    }

    if (quantity <= 5) {
      return 'low-stock';
    }

    return 'in-stock';
  }

  getStockLabel(quantity: number): string {
    if (quantity === 0) {
      return 'Stoc epuizat';
    }

    if (quantity <= 5) {
      return 'Stoc redus';
    }

    return 'În stoc';
  }

  getImageUrl(imageUrl?: string): string {
    return this.commonService.getImageUrl(imageUrl);
  }

  openDeleteDialog(product: Book): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '440px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirmation-dialog-panel',
      data: {
        title: 'Șterge produsul',
        message: `Sigur dorești să ștergi cartea „${product.bookName}”?`,
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
          this.deleteProduct(product);
        }
      });
  }

  trackByBookId(index: number, product: Book): number {
    return product.bookId;
  }

  private deleteProduct(product: Book): void {
    this.adminService.deleteProduct(product.bookId).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess('Produsul a fost șters.');

        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Produsul nu a putut fi șters.',
        );
      },
    });
  }

  private listenToSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadProducts();
      });
  }

  private loadProducts(): void {
    this.isLoading = true;

    this.adminService
      .getProducts(
        this.searchControl.value ?? '',
        this.pageIndex,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
      )
      .subscribe({
        next: (response: PageResponse<Book>) => {
          this.products = response.content;
          this.totalElements = response.totalElements;

          this.pageIndex = response.number;
          this.pageSize = response.size;

          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;

          this.commonService.showHttpError(
            error,
            'Produsele nu au putut fi încărcate.',
          );
        },
      });
  }
}
