import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.addresses && this.addresses.length === 0) {
      this.showNewAddressForm = true;
      this.selectedAddressId = null;
    }
  }

  showNewAddressForm = false;

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

  trackByAddressId(index: number, address: Address): number | undefined {
    return address.addressId;
  }
}
