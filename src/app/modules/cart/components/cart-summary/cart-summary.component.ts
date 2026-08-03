import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  @Input() totalItems = 0;
  @Input() subtotal = 0;
  @Input() shippingPrice = 0;
  @Input() totalPrice = 0;
}
