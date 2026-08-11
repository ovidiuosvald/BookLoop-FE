import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Enums
import { BillingType } from 'src/app/enums/order.enums';

// Models
import { County, Locality } from 'src/app/models/location.model';

// Services
import { CommonService } from 'src/app/services/common.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-checkout-billing',
  templateUrl: './checkout-billing.component.html',
  styleUrls: ['./checkout-billing.component.scss'],
})
export class CheckoutBillingComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  readonly billingType = BillingType;

  counties: County[] = [];
  localities: Locality[] = [];

  isLoadingCounties = false;
  isLoadingLocalities = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly locationService: LocationService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.initializeCountry();
    this.initializeCityControl();
    this.loadCounties();
    this.listenToCountyChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // FORM
  // =========================

  get isCompany(): boolean {
    return this.form.get('type')?.value === BillingType.Company;
  }

  get companyForm(): FormGroup {
    return this.form.get('companyDetails') as FormGroup;
  }

  getControl(controlName: string): AbstractControl {
    return this.companyForm.get(controlName)!;
  }

  selectBillingType(type: BillingType): void {
    this.form.get('type')?.setValue(type);
  }

  shouldShowError(controlName: string): boolean {
    const control = this.getControl(controlName);

    return Boolean(control.invalid && (control.touched || control.dirty));
  }

  getError(controlName: string): string {
    const control = this.getControl(controlName);

    if (!control.errors) {
      return '';
    }

    const labels: Record<string, string> = {
      companyName: 'Denumirea companiei',
      cui: 'CUI-ul',
      registrationNumber: 'Numărul de înregistrare',
      bank: 'Banca',
      bankAccount: 'Contul bancar',
      country: 'Țara',
      county: 'Județul',
      city: 'Localitatea',
      addressLine: 'Adresa companiei',
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

  // =========================
  // INITIALIZATION
  // =========================

  private initializeCountry(): void {
    const countryControl = this.companyForm.get('country');

    if (!countryControl) {
      return;
    }

    countryControl.setValue('România', {
      emitEvent: false,
    });

    countryControl.disable({
      emitEvent: false,
    });
  }

  private initializeCityControl(): void {
    const county = this.companyForm.get('county')?.value;
    const cityControl = this.companyForm.get('city');

    if (!cityControl) {
      return;
    }

    if (!county) {
      cityControl.disable({
        emitEvent: false,
      });
    }
  }

  // =========================
  // COUNTY
  // =========================

  private loadCounties(): void {
    this.isLoadingCounties = true;

    this.locationService
      .getCounties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (counties: County[]) => {
          this.counties = counties;
          this.isLoadingCounties = false;

          this.loadExistingLocation();
        },

        error: () => {
          this.counties = [];
          this.isLoadingCounties = false;

          this.commonService.showSnackBarError(
            'Județele nu au putut fi încărcate.',
          );
        },
      });
  }

  private listenToCountyChanges(): void {
    const countyControl = this.companyForm.get('county');

    if (!countyControl) {
      return;
    }

    countyControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((countyName: string | null) => {
        this.handleCountyChange(countyName);
      });
  }

  private handleCountyChange(countyName: string | null): void {
    const cityControl = this.companyForm.get('city');

    if (!cityControl) {
      return;
    }

    this.localities = [];

    cityControl.reset('', {
      emitEvent: false,
    });

    cityControl.disable({
      emitEvent: false,
    });

    if (!countyName) {
      return;
    }

    const county = this.counties.find((item) => item.name === countyName);

    if (!county) {
      return;
    }

    this.loadLocalities(county.code);
  }

  // =========================
  // CITY
  // =========================

  private loadLocalities(countyCode: string, existingCity?: string): void {
    const cityControl = this.companyForm.get('city');

    if (!cityControl) {
      return;
    }

    this.isLoadingLocalities = true;

    this.locationService
      .getLocalities(countyCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (localities: Locality[]) => {
          this.localities = localities;
          this.isLoadingLocalities = false;

          cityControl.enable({
            emitEvent: false,
          });

          if (existingCity) {
            cityControl.setValue(existingCity, {
              emitEvent: false,
            });
          }
        },

        error: () => {
          this.localities = [];
          this.isLoadingLocalities = false;

          cityControl.disable({
            emitEvent: false,
          });

          this.commonService.showSnackBarError(
            'Localitățile nu au putut fi încărcate.',
          );
        },
      });
  }

  // =========================
  // EDIT MODE
  // =========================

  private loadExistingLocation(): void {
    const countyName = this.companyForm.get('county')?.value;
    const cityName = this.companyForm.get('city')?.value;

    if (!countyName) {
      return;
    }

    const county = this.counties.find((item) => item.name === countyName);

    if (!county) {
      return;
    }

    this.loadLocalities(county.code, cityName);
  }

  // =========================
  // VALIDATION
  // =========================

  private getPatternError(controlName: string): string {
    switch (controlName) {
      case 'cui':
        return 'Introdu un CUI valid.';

      case 'bankAccount':
        return 'Introdu un IBAN românesc valid, fără spații.';

      default:
        return 'Valoarea introdusă nu are un format valid.';
    }
  }
}
