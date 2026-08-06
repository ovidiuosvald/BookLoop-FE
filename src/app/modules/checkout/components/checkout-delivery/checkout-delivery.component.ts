import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DeliveryMethod } from 'src/app/enums/order.enums';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss'],
})
export class CheckoutDeliveryComponent {
  @Input() form!: FormGroup;

  readonly deliveryMethod = DeliveryMethod;

  selectMethod(method: DeliveryMethod): void {
    this.form.get('method')?.setValue(method);
  }
}
