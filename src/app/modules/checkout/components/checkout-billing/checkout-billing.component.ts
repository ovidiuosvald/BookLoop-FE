import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-billing',
  templateUrl: './checkout-billing.component.html',
  styleUrls: ['./checkout-billing.component.scss'],
})
export class CheckoutBillingComponent {
  @Input() form!: FormGroup;

  get isCompany(): boolean {
    return this.form.get('type')?.value === 'COMPANY';
  }
}
