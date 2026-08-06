import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
})
export class CheckoutAddressComponent implements OnChanges {
  @Input() addresses: Address[] = [];
  @Input() form!: FormGroup;
  @Input() selectedAddressId: number | null = null;

  @Output() selectedAddressIdChange = new EventEmitter<number | null>();

  showNewAddressForm = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.addresses && this.addresses.length === 0) {
      this.showNewAddressForm = true;
      this.selectedAddressId = null;
    }
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId = addressId;
    this.showNewAddressForm = false;

    this.selectedAddressIdChange.emit(addressId);
  }

  showAddressForm(): void {
    this.selectedAddressId = null;
    this.showNewAddressForm = true;

    this.selectedAddressIdChange.emit(null);
  }

  cancelNewAddress(): void {
    this.showNewAddressForm = false;

    const defaultAddress =
      this.addresses.find((address) => address.isDefault) ?? this.addresses[0];

    if (defaultAddress?.addressId) {
      this.selectAddress(defaultAddress.addressId);
    }
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control || !control.errors) {
      return '';
    }

    const labels: Record<string, string> = {
      firstName: 'Prenumele',
      lastName: 'Numele',
      phoneNumber: 'Numărul de telefon',
      country: 'Țara',
      county: 'Județul',
      city: 'Orașul',
      addressLine: 'Adresa',
      postalCode: 'Codul poștal',
    };

    const label = labels[controlName] ?? 'Câmpul';

    if (control.hasError('required')) {
      return `${label} este obligatoriu.`;
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;

      return `${label} trebuie să conțină minimum ${requiredLength} caractere.`;
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;

      return `${label} poate avea maximum ${requiredLength} caractere.`;
    }

    if (control.hasError('pattern')) {
      return this.getPatternError(controlName);
    }

    return `${label} nu este valid.`;
  }

  shouldShowError(controlName: string): boolean {
    const control = this.form.get(controlName);

    return Boolean(
      control && control.invalid && (control.touched || control.dirty),
    );
  }

  trackByAddressId(index: number, address: Address): number | undefined {
    return address.addressId;
  }

  private getPatternError(controlName: string): string {
    switch (controlName) {
      case 'phoneNumber':
        return 'Introdu un număr de telefon valid, de exemplu 0712345678.';

      case 'postalCode':
        return 'Codul poștal trebuie să conțină exact 6 cifre.';

      default:
        return 'Valoarea introdusă nu are un format valid.';
    }
  }
}
