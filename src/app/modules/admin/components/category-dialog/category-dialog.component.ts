import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
  categoryForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      category?: Category;
    },
  ) {}

  get isEditMode(): boolean {
    return !!this.data.category;
  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      categoryName: [
        this.data.category?.categoryName ?? '',
        Validators.required,
      ],
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryName = this.categoryForm.getRawValue().categoryName.trim();

    this.dialogRef.close({
      categoryName,
    });
  }
}
