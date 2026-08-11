import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// Enums
import { PaymentMethod } from 'src/app/enums/order.enums';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent {
  @Input() form!: FormGroup;

  readonly paymentMethod = PaymentMethod;

  selectMethod(method: PaymentMethod): void {
    if (method === PaymentMethod.Card) {
      return;
    }

    this.form.get('method')?.setValue(method);
  }
}
