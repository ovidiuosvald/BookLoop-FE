import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.scss'],
})
export class CartCheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  counties = ['Bihor', 'Cluj', 'Timiș']; // le poți popula din API
  cities = ['Oradea', 'Cluj-Napoca', 'Timișoara']; // filtrare din județ posibilă

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      delivery: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        method: ['courier', Validators.required],
        country: new FormControl(
          { value: 'romania', disabled: true },
          Validators.required
        ),
        county: ['', Validators.required],
        city: ['', Validators.required],
        address: ['', Validators.required],
        saveAddress: [false],
      }),
      billing: this.fb.group({
        type: ['fizica', Validators.required],
        companyDetails: this.fb.group({
          name: [''],
          cui: [''],
          regNumber: [''],
          bank: [''],
          account: [''],
          country: new FormControl({ value: 'romania', disabled: true }),
          county: [''],
          city: [''],
          address: [''],
          saveCompanyDetails: [false],
        }),
      }),
      payment: this.fb.group({
        method: ['ramburs', Validators.required],
      }),
      termsChecked: this.fb.group({
        checkTerms: [false, Validators.required],
        newsletter: [false],
      }),
    });
  }

  get companyDetailsGroup(): FormGroup {
    return this.checkoutForm.get('billing.companyDetails') as FormGroup;
  }

  ngOnInit(): void {
    this.checkoutForm.get('billing.type')?.valueChanges.subscribe((type) => {
      const companyGroup = this.checkoutForm.get(
        'billing.companyDetails'
      ) as FormGroup;
      if (type === 'juridica') {
        companyGroup.get('name')?.setValidators([Validators.required]);
        companyGroup.get('cui')?.setValidators([Validators.required]);
        // ... restul
      } else {
        companyGroup.reset(); // curăță câmpurile
        companyGroup.get('name')?.clearValidators();
        companyGroup.get('cui')?.clearValidators();
      }
      companyGroup.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log(this.checkoutForm.value);
      // merge mai departe în procesul de checkout
    }
  }

  nextStep() {}
}
