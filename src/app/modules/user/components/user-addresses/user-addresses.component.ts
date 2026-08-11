import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { Address } from 'src/app/models/address.model';

import { AddressService } from 'src/app/services/address.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';

@Component({
  selector: 'app-user-addresses',
  templateUrl: './user-addresses.component.html',
  styleUrls: ['./user-addresses.component.scss'],
})
export class UserAddressesComponent implements OnInit {
  addresses: Address[] = [];
  isLoading = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  openAddressDialog(address?: Address): void {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '820px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100vh - 48px)',
      autoFocus: false,
      disableClose: true,
      panelClass: 'address-dialog-panel',
      data: address ?? null,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((saved: boolean | undefined) => {
        if (saved) {
          this.loadAddresses();
        }
      });
  }

  setDefaultAddress(address: Address): void {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId || !address.addressId) {
      return;
    }

    this.addressService.setDefaultAddress(userId, address.addressId).subscribe({
      next: () => {
        this.addresses = this.addresses
          .map((item) => ({
            ...item,
            isDefault: item.addressId === address.addressId,
          }))
          .sort(
            (first, second) =>
              Number(second.isDefault) - Number(first.isDefault),
          );

        this.commonService.showSnackBarSuccess(
          'Adresa implicită a fost actualizată.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Adresa implicită nu a putut fi actualizată.',
        );
      },
    });
  }

  openDeleteDialog(address: Address): void {
    if (!address.addressId) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirmation-dialog-panel',
      data: {
        title: 'Șterge adresa',
        message: 'Sigur dorești să ștergi această adresă?',
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
          this.deleteAddress(address.addressId!);
        }
      });
  }

  trackByAddressId(index: number, address: Address): number | undefined {
    return address.addressId;
  }

  private loadAddresses(): void {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      this.isLoading = false;

      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    this.isLoading = true;

    this.addressService.getUserAddresses(userId).subscribe({
      next: (addresses: Address[]) => {
        this.addresses = addresses;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Adresele nu au putut fi încărcate.',
        );
      },
    });
  }

  private deleteAddress(addressId: number): void {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      return;
    }

    this.addressService.deleteAddress(userId, addressId).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(
          (address) => address.addressId !== addressId,
        );

        this.commonService.showSnackBarSuccess('Adresa a fost ștearsă.');
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Adresa nu a putut fi ștearsă.',
        );
      },
    });
  }
}
