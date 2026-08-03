import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Address } from 'src/app/models/address.model';
import { Cart } from 'src/app/models/cart.model';
import { AddressService } from 'src/app/services/address.service';
import { CartService } from 'src/app/services/cart.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit {
  cart!: Cart;
  addresses: Address[] = [];

  selectedAddressId: number | null = null;

  isLoading = true;

  constructor(
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  private loadCheckoutData(): void {
    const userId = this.userService.authenticatedUser.userId;

    if (!userId) {
      this.isLoading = false;

      this.commonService.showSnackBarError(
        'Trebuie să fii autentificat pentru a finaliza comanda.',
      );

      this.commonService.goToLoginPage();
      return;
    }

    forkJoin({
      cart: this.cartService.getCart(userId),
      addresses: this.addressService.getUserAddresses(userId),
    }).subscribe({
      next: ({ cart, addresses }) => {
        this.cart = cart;
        this.addresses = addresses;

        this.selectInitialAddress();

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.commonService.showHttpError(
          error,
          'Datele necesare pentru finalizarea comenzii nu au putut fi încărcate.',
        );
      },
    });
  }

  private selectInitialAddress(): void {
    const defaultAddress = this.addresses.find((address) => address.isDefault);

    if (defaultAddress?.addressId) {
      this.selectedAddressId = defaultAddress.addressId;
      return;
    }

    const firstAddress = this.addresses[0];

    if (firstAddress?.addressId) {
      this.selectedAddressId = firstAddress.addressId;
    }
  }
}
