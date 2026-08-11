import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Models
import { County, Locality } from 'src/app/models/location.model';

// Services
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  counties: County[] = [];
  localities: Locality[] = [];

  isLoadingCounties = false;
  isLoadingLocalities = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly locationService: LocationService) {}

  ngOnInit(): void {
    this.initializeCountry();
    this.initializeCityControl();
    this.loadCounties();
    this.listenToCountyChanges();
    this.listenToCityChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // FORM
  // =========================

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  shouldShowError(controlName: string): boolean {
    const control = this.form.get(controlName);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control?.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Acest câmp este obligatoriu.';
    }

    if (control.hasError('pattern')) {
      switch (controlName) {
        case 'phoneNumber':
          return 'Numărul de telefon nu este valid.';

        case 'postalCode':
          return 'Codul poștal nu este valid.';

        default:
          return 'Valoarea introdusă nu este validă.';
      }
    }

    if (control.hasError('minlength')) {
      return 'Valoarea introdusă este prea scurtă.';
    }

    if (control.hasError('maxlength')) {
      return 'Valoarea introdusă este prea lungă.';
    }

    return 'Valoarea introdusă nu este validă.';
  }

  // =========================
  // INITIALIZATION
  // =========================

  private initializeCountry(): void {
    const countryControl = this.form.get('country');

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
    const county = this.form.get('county')?.value;

    const cityControl = this.form.get('city');

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
        },
      });
  }

  private listenToCountyChanges(): void {
    const countyControl = this.form.get('county');

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
    const cityControl = this.form.get('city');

    const postalCodeControl = this.form.get('postalCode');

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

    postalCodeControl?.setValue('', {
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

  private listenToCityChanges(): void {
    const cityControl = this.form.get('city');

    if (!cityControl) {
      return;
    }

    cityControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((cityName: string | null) => {
        this.updatePostalCode(cityName);
      });
  }

  private loadLocalities(countyCode: string, existingCity?: string): void {
    const cityControl = this.form.get('city');

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
            cityControl.setValue(existingCity);
          }
        },
        error: () => {
          this.localities = [];

          this.isLoadingLocalities = false;

          cityControl.disable({
            emitEvent: false,
          });
        },
      });
  }

  private updatePostalCode(cityName: string | null): void {
    if (!cityName) {
      return;
    }

    const locality = this.localities.find((item) => item.name === cityName);

    if (!locality?.postalCode) {
      return;
    }

    this.form.get('postalCode')?.setValue(locality.postalCode, {
      emitEvent: false,
    });
  }

  // =========================
  // EDIT MODE
  // =========================

  private loadExistingLocation(): void {
    const countyName = this.form.get('county')?.value;

    const cityName = this.form.get('city')?.value;

    if (!countyName) {
      return;
    }

    const county = this.counties.find((item) => item.name === countyName);

    if (!county) {
      return;
    }

    this.loadLocalities(county.code, cityName);
  }
}
