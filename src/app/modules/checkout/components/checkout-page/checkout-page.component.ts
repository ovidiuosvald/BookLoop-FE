import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Enums
import {
  BillingType,
  DeliveryMethod,
  PaymentMethod,
} from 'src/app/enums/order.enums';

// Models
import { Address } from 'src/app/models/address.model';
import { Cart } from 'src/app/models/cart.model';
import { PlaceOrderRequest } from 'src/app/models/place-order-request.model';

// Services
import { AddressService } from 'src/app/services/address.service';
import { CartService } from 'src/app/services/cart.service';
import { CommonService } from 'src/app/services/common.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

// Validators
import {
  ADDRESS_MAX_LENGTH,
  ADDRESS_MIN_LENGTH,
  CITY_MAX_LENGTH,
  CITY_MIN_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  CUI_REGEX,
  IBAN_REGEX,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PHONE_REGEX,
  POSTAL_CODE_REGEX,
} from 'src/app/validators/validation.constants';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit {
  checkoutForm!: FormGroup;

  cart?: Cart;
  addresses: Address[] = [];

  selectedAddressId: number | null = null;

  isLoading = true;
  isPlacingOrder = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.listenToBillingTypeChanges();
    this.loadCheckoutData();
  }

  // =========================
  // FORM GETTERS
  // =========================

  get deliveryAddressForm(): FormGroup {
    return this.checkoutForm.get('deliveryAddress') as FormGroup;
  }

  get deliveryForm(): FormGroup {
    return this.checkoutForm.get('delivery') as FormGroup;
  }

  get billingForm(): FormGroup {
    return this.checkoutForm.get('billing') as FormGroup;
  }

  get companyDetailsForm(): FormGroup {
    return this.billingForm.get('companyDetails') as FormGroup;
  }

  get paymentForm(): FormGroup {
    return this.checkoutForm.get('payment') as FormGroup;
  }

  // =========================
  // ADDRESS
  // =========================

  onSelectedAddressIdChange(addressId: number | null): void {
    this.selectedAddressId = addressId;

    if (addressId !== null) {
      this.deliveryAddressForm.disable({
        emitEvent: false,
      });

      return;
    }

    this.enableDeliveryAddressForm();
  }

  // =========================
  // ORDER
  // =========================

  placeOrder(): void {
    if (this.isPlacingOrder) {
      return;
    }

    const userId = this.getUserId();

    if (!userId) {
      return;
    }

    if (!this.cart?.items.length) {
      this.commonService.showSnackBarWarning('Coșul este gol.');

      return;
    }

    if (this.selectedAddressId === null) {
      this.deliveryAddressForm.markAllAsTouched();
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();

      this.commonService.showSnackBarWarning(
        'Completează toate câmpurile obligatorii.',
      );

      return;
    }

    const request = this.buildPlaceOrderRequest();

    this.isPlacingOrder = true;

    this.orderService.placeOrder(userId, request).subscribe({
      next: (order) => {
        this.isPlacingOrder = false;

        this.commonService.showSnackBarSuccess(
          'Comanda a fost plasată cu succes.',
        );

        this.router.navigate(['/checkout/success'], {
          state: {
            order,
          },
        });
      },

      error: (error: HttpErrorResponse) => {
        this.isPlacingOrder = false;

        this.commonService.showHttpError(
          error,
          'Comanda nu a putut fi plasată.',
        );
      },
    });
  }

  // =========================
  // FORM
  // =========================

  private buildForm(): void {
    const companyDetailsForm = this.formBuilder.group({
      companyName: [
        '',
        [
          Validators.required,
          Validators.minLength(NAME_MIN_LENGTH),
          Validators.maxLength(COMPANY_NAME_MAX_LENGTH),
        ],
      ],

      cui: ['', [Validators.required, Validators.pattern(CUI_REGEX)]],

      registrationNumber: ['', Validators.maxLength(50)],

      bank: ['', Validators.maxLength(100)],

      bankAccount: ['', Validators.pattern(IBAN_REGEX)],

      country: [
        {
          value: 'România',
          disabled: true,
        },
        Validators.required,
      ],

      county: ['', Validators.required],

      city: [
        '',
        [
          Validators.required,
          Validators.minLength(CITY_MIN_LENGTH),
          Validators.maxLength(CITY_MAX_LENGTH),
        ],
      ],

      addressLine: [
        '',
        [
          Validators.required,
          Validators.minLength(ADDRESS_MIN_LENGTH),
          Validators.maxLength(ADDRESS_MAX_LENGTH),
        ],
      ],
    });

    /*
     * Persoană fizică este valoarea implicită,
     * deci formularul companiei nu trebuie
     * să participe la validarea checkout-ului.
     */
    companyDetailsForm.disable({
      emitEvent: false,
    });

    this.checkoutForm = this.formBuilder.group({
      deliveryAddress: this.formBuilder.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
          ],
        ],

        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(NAME_MIN_LENGTH),
            Validators.maxLength(NAME_MAX_LENGTH),
          ],
        ],

        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(PHONE_REGEX)],
        ],

        country: [
          {
            value: 'România',
            disabled: true,
          },
          Validators.required,
        ],

        county: ['', Validators.required],

        city: [
          '',
          [
            Validators.required,
            Validators.minLength(CITY_MIN_LENGTH),
            Validators.maxLength(CITY_MAX_LENGTH),
          ],
        ],

        addressLine: [
          '',
          [
            Validators.required,
            Validators.minLength(ADDRESS_MIN_LENGTH),
            Validators.maxLength(ADDRESS_MAX_LENGTH),
          ],
        ],

        postalCode: ['', Validators.pattern(POSTAL_CODE_REGEX)],
        isDefault: [false],
        saveDeliveryAddress: [false],
      }),

      delivery: this.formBuilder.group({
        method: [DeliveryMethod.Courier, Validators.required],
      }),

      billing: this.formBuilder.group({
        type: [BillingType.Individual, Validators.required],

        companyDetails: companyDetailsForm,
      }),

      payment: this.formBuilder.group({
        method: [PaymentMethod.CashOnDelivery, Validators.required],
      }),

      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  private listenToBillingTypeChanges(): void {
    this.billingForm
      .get('type')
      ?.valueChanges.subscribe((billingType: BillingType) => {
        if (billingType === BillingType.Company) {
          this.enableCompanyDetailsForm();

          return;
        }

        this.companyDetailsForm.disable({
          emitEvent: false,
        });
      });
  }

  private enableCompanyDetailsForm(): void {
    this.companyDetailsForm.enable({
      emitEvent: false,
    });

    /*
     * Țara este fixă și nu trebuie editată.
     * enable() pe FormGroup activează toate controalele,
     * așa că o dezactivăm din nou explicit.
     */
    this.companyDetailsForm.get('country')?.disable({
      emitEvent: false,
    });

    /*
     * Localitatea trebuie selectată doar după
     * alegerea județului.
     */
    const county = this.companyDetailsForm.get('county')?.value;

    if (!county) {
      this.companyDetailsForm.get('city')?.disable({
        emitEvent: false,
      });
    }
  }

  private enableDeliveryAddressForm(): void {
    this.deliveryAddressForm.enable({
      emitEvent: false,
    });

    /*
     * AddressFormComponent tratează țara
     * ca valoare fixă.
     *
     * enable() pe FormGroup ar activa însă
     * și acest control, de aceea îl dezactivăm
     * din nou explicit.
     */
    this.deliveryAddressForm.get('country')?.disable({
      emitEvent: false,
    });

    /*
     * Localitatea trebuie selectată doar după
     * alegerea județului.
     */
    const county = this.deliveryAddressForm.get('county')?.value;

    if (!county) {
      this.deliveryAddressForm.get('city')?.disable({
        emitEvent: false,
      });
    }
  }

  // =========================
  // DATA
  // =========================

  private loadCheckoutData(): void {
    const userId = this.getUserId(false);

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
          'Datele necesare finalizării comenzii nu au putut fi încărcate.',
        );
      },
    });
  }

  private selectInitialAddress(): void {
    const defaultAddress =
      this.addresses.find((address) => address.isDefault) ?? this.addresses[0];

    this.selectedAddressId = defaultAddress?.addressId ?? null;

    if (this.selectedAddressId !== null) {
      this.deliveryAddressForm.disable({
        emitEvent: false,
      });

      return;
    }

    this.enableDeliveryAddressForm();
  }

  // =========================
  // REQUEST
  // =========================

  private buildPlaceOrderRequest(): PlaceOrderRequest {
    const deliveryMethod = this.deliveryForm.get('method')
      ?.value as DeliveryMethod;

    const billingType = this.billingForm.get('type')?.value as BillingType;

    const paymentMethod = this.paymentForm.get('method')
      ?.value as PaymentMethod;

    /*
     * getRawValue este intenționat:
     * country este disabled atât pentru
     * adresa de livrare, cât și pentru companie.
     */
    const deliveryAddressValue = this.deliveryAddressForm.getRawValue();

    const companyDetailsValue = this.companyDetailsForm.getRawValue();

    const usesSavedAddress = this.selectedAddressId !== null;

    return {
      addressId: usesSavedAddress
        ? (this.selectedAddressId ?? undefined)
        : undefined,

      saveDeliveryAddress:
        !usesSavedAddress && Boolean(deliveryAddressValue.saveDeliveryAddress),

      billingSameAsDelivery: true,

      deliveryMethod,
      paymentMethod,
      billingType,

      deliveryAddress: usesSavedAddress
        ? undefined
        : {
            firstName: deliveryAddressValue.firstName.trim(),

            lastName: deliveryAddressValue.lastName.trim(),

            phoneNumber: deliveryAddressValue.phoneNumber.trim(),

            country: deliveryAddressValue.country,

            county: deliveryAddressValue.county.trim(),

            city: deliveryAddressValue.city.trim(),

            addressLine: deliveryAddressValue.addressLine.trim(),

            postalCode: deliveryAddressValue.postalCode?.trim() || undefined,

            isDefault:
              !usesSavedAddress &&
              Boolean(
                deliveryAddressValue.saveDeliveryAddress &&
                deliveryAddressValue.isDefault,
              ),
          },

      billingAddress: undefined,

      companyDetails:
        billingType === BillingType.Company
          ? {
              companyName: companyDetailsValue.companyName.trim(),

              cui: companyDetailsValue.cui.trim(),

              registrationNumber:
                companyDetailsValue.registrationNumber?.trim() || undefined,

              bank: companyDetailsValue.bank?.trim() || undefined,

              bankAccount: companyDetailsValue.bankAccount?.trim() || undefined,

              country: companyDetailsValue.country,

              county: companyDetailsValue.county.trim(),

              city: companyDetailsValue.city.trim(),

              addressLine: companyDetailsValue.addressLine.trim(),
            }
          : undefined,
    };
  }

  // =========================
  // USER
  // =========================

  private getUserId(showError = true): number | undefined {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId && showError) {
      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );
    }

    return userId;
  }
}
