import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Models
import { Address } from 'src/app/models/address.model';

// Services
import { AddressService } from 'src/app/services/address.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss'],
})
export class AddressDialogComponent implements OnInit {
  form!: FormGroup;

  isSaving = false;

  get isEditMode(): boolean {
    return !!this.data?.addressId;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: Address | null,
    private readonly dialogRef: MatDialogRef<AddressDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    const address: Address = {
      ...this.form.getRawValue(),
      addressId: this.data?.addressId,
      userId,
    };

    this.isSaving = true;

    if (this.isEditMode && this.data?.addressId) {
      this.updateAddress(userId, this.data.addressId, address);

      return;
    }

    this.createAddress(userId, address);
  }

  close(): void {
    this.dialogRef.close();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      firstName: [
        this.data?.firstName ?? '',
        [Validators.required, Validators.maxLength(100)],
      ],

      lastName: [
        this.data?.lastName ?? '',
        [Validators.required, Validators.maxLength(100)],
      ],

      phoneNumber: [
        this.data?.phoneNumber ?? '',
        [Validators.required, Validators.pattern(/^0[0-9]{9}$/)],
      ],

      country: [
        {
          value: this.data?.country ?? 'România',
          disabled: true,
        },
        Validators.required,
      ],

      county: [this.data?.county ?? '', Validators.required],

      city: [
        {
          value: this.data?.city ?? '',
          disabled: !this.data?.county,
        },
        Validators.required,
      ],

      addressLine: [
        this.data?.addressLine ?? '',
        [Validators.required, Validators.maxLength(255)],
      ],

      postalCode: [
        this.data?.postalCode ?? '',
        [Validators.pattern(/^[0-9]{6}$/)],
      ],

      isDefault: [this.data?.isDefault ?? false],
    });
  }

  private createAddress(userId: number, address: Address): void {
    this.addressService.createAddress(userId, address).subscribe({
      next: () => {
        this.isSaving = false;

        this.commonService.showSnackBarSuccess('Adresa a fost adăugată.');

        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Adresa nu a putut fi adăugată.',
        );
      },
    });
  }

  private updateAddress(
    userId: number,
    addressId: number,
    address: Address,
  ): void {
    this.addressService.updateAddress(userId, addressId, address).subscribe({
      next: () => {
        this.isSaving = false;

        this.commonService.showSnackBarSuccess('Adresa a fost actualizată.');

        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Adresa nu a putut fi actualizată.',
        );
      },
    });
  }
}
