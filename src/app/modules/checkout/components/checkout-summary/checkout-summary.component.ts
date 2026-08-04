import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Cart } from 'src/app/models/cart.model';

@Component({
  selector: 'app-checkout-summary',
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.scss'],
})
export class CheckoutSummaryComponent {
  @Input() cart!: Cart;
  @Input() loading = false;
  @Input() canPlaceOrder = true;

  @Output() placeOrder = new EventEmitter<void>();

  onPlaceOrder(): void {
    this.placeOrder.emit();
  }
}
