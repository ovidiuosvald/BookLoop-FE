import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.model';
import { AdminService } from 'src/app/services/admin.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin-product-form',
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.scss'],
})
export class AdminProductFormComponent implements OnInit {
  productForm!: FormGroup;

  categories: Category[] = [];

  isLoading = false;
  isSaving = false;

  isEditMode = false;
  bookId?: number;

  selectedCoverFile?: File;
  selectedPromoFile?: File;

  coverPreview?: string;
  promoPreview?: string;

  private currentCoverUrl = '';
  private currentPromoImageUrl = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminService,
    private readonly categoryService: CategoryService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
    this.resolveMode();
  }

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();

      this.commonService.showSnackBarWarning(
        'Completează corect câmpurile obligatorii.',
      );

      return;
    }

    if (!this.isEditMode && !this.selectedCoverFile) {
      this.commonService.showSnackBarWarning(
        'Selectează o imagine pentru copertă.',
      );

      return;
    }

    this.isSaving = true;

    const coverUpload$ = this.selectedCoverFile
      ? this.adminService.uploadProductImage(this.selectedCoverFile, 'COVER')
      : of(this.currentCoverUrl);

    const promoUpload$ = this.selectedPromoFile
      ? this.adminService.uploadProductImage(this.selectedPromoFile, 'PROMO')
      : of(this.currentPromoImageUrl);

    forkJoin({
      coverUrl: coverUpload$,
      promoImageUrl: promoUpload$,
    }).subscribe({
      next: ({ coverUrl, promoImageUrl }) => {
        const product = this.buildProduct(coverUrl, promoImageUrl);

        if (!product) {
          this.isSaving = false;
          return;
        }

        this.saveProduct(product);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Imaginile nu au putut fi încărcate.',
        );
      },
    });
  }

  cancel(): void {
    this.commonService.goToAdminProducts();
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!this.validateImageFile(file)) {
      input.value = '';
      return;
    }

    this.selectedCoverFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.coverPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  onPromoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!this.validateImageFile(file)) {
      input.value = '';
      return;
    }

    this.selectedPromoFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.promoPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  copyDescription(): void {
    const description = this.productForm.get('description')?.value?.trim();

    if (!description) {
      this.commonService.showSnackBarWarning(
        'Nu există o descriere de copiat.',
      );
      return;
    }

    navigator.clipboard.writeText(description).then(() => {
      this.commonService.showSnackBarSuccess('Descrierea a fost copiată.');
    });
  }

  removePromoImage(): void {
    this.selectedPromoFile = undefined;
    this.promoPreview = undefined;
    this.currentPromoImageUrl = '';
  }

  private buildForm(): void {
    this.productForm = this.formBuilder.group({
      bookName: ['', Validators.required],

      author: ['', Validators.required],

      publisher: [''],

      numberOfPages: [null, Validators.min(1)],

      yearOfPublication: [null, Validators.min(1)],

      currentPrice: [null, [Validators.required, Validators.min(0)]],

      quantity: [null, [Validators.required, Validators.min(0)]],

      categoryId: [null, Validators.required],

      description: ['', Validators.required],

      isNew: [false],
      isBestseller: [false],
    });
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

  private resolveMode(): void {
    const bookIdParam = this.route.snapshot.paramMap.get('bookId');

    if (!bookIdParam) {
      this.isEditMode = false;
      return;
    }

    const bookId = Number(bookIdParam);

    if (!bookId || Number.isNaN(bookId)) {
      this.commonService.showSnackBarError('Produsul selectat nu este valid.');

      this.commonService.goToAdminProducts();
      return;
    }

    this.isEditMode = true;
    this.bookId = bookId;

    this.loadProduct(bookId);
  }

  private loadProduct(bookId: number): void {
    this.isLoading = true;

    this.adminService.getProduct(bookId).subscribe({
      next: (product: Book) => {
        const categoryId =
          typeof product.category === 'string'
            ? null
            : (product.category?.categoryId ?? null);

        this.currentCoverUrl = product.coverUrl;

        this.coverPreview = this.commonService.getImageUrl(product.coverUrl);

        this.currentPromoImageUrl = product.promoImageUrl ?? '';

        this.promoPreview = product.promoImageUrl
          ? this.commonService.getImageUrl(product.promoImageUrl)
          : undefined;

        this.productForm.patchValue({
          bookName: product.bookName,

          author: product.author,

          publisher: product.publisher ?? '',

          numberOfPages: product.numberOfPages ?? null,

          yearOfPublication: product.yearOfPublication ?? null,

          currentPrice: product.currentPrice,

          quantity: product.quantity,

          categoryId,

          description: product.description ?? '',

          isNew: product.isNew,

          isBestseller: product.isBestseller,
        });

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Produsul nu a putut fi încărcat.',
        );

        this.commonService.goToAdminProducts();
      },
    });
  }

  private validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.commonService.showSnackBarError(
        'Sunt acceptate doar imagini JPG, JPEG sau PNG.',
      );

      return false;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.commonService.showSnackBarError('Imaginea nu poate depăși 5 MB.');

      return false;
    }

    return true;
  }

  private buildProduct(coverUrl: string, promoImageUrl: string): Book | null {
    const value = this.productForm.getRawValue();

    const selectedCategory = this.categories.find(
      (category) => category.categoryId === value.categoryId,
    );

    if (!selectedCategory) {
      this.commonService.showSnackBarError(
        'Categoria selectată nu este validă.',
      );

      return null;
    }

    return {
      bookId: this.bookId ?? 0,

      bookName: value.bookName.trim(),

      author: value.author.trim(),

      publisher: value.publisher?.trim() || undefined,

      numberOfPages: value.numberOfPages ?? undefined,

      yearOfPublication: value.yearOfPublication ?? undefined,

      currentPrice: Number(value.currentPrice),

      quantity: Number(value.quantity),

      category: selectedCategory,

      coverUrl,

      promoImageUrl: promoImageUrl || undefined,

      description: value.description?.trim() || '',

      isNew: Boolean(value.isNew),

      isBestseller: Boolean(value.isBestseller),

      isFavorite: false,
    };
  }

  private saveProduct(product: Book): void {
    if (this.isEditMode && this.bookId) {
      this.updateProduct(product);
      return;
    }

    this.createProduct(product);
  }

  private createProduct(product: Book): void {
    this.adminService.createProduct(product).subscribe({
      next: () => {
        this.isSaving = false;

        this.commonService.showSnackBarSuccess(
          'Produsul a fost adăugat cu succes.',
        );

        this.commonService.goToAdminProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Produsul nu a putut fi adăugat.',
        );
      },
    });
  }

  private updateProduct(product: Book): void {
    if (!this.bookId) {
      this.isSaving = false;
      return;
    }

    this.adminService.updateProduct(this.bookId, product).subscribe({
      next: () => {
        this.isSaving = false;

        this.commonService.showSnackBarSuccess(
          'Produsul a fost actualizat cu succes.',
        );

        this.commonService.goToAdminProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Produsul nu a putut fi actualizat.',
        );
      },
    });
  }
}
