import { Component, EventEmitter, Input, Output } from '@angular/core';

// Enums
import { DeliveryMethod } from 'src/app/enums/order.enums';

// Models
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
  @Input() deliveryMethod!: DeliveryMethod;

  @Output() placeOrder = new EventEmitter<void>();

  readonly freeShippingLimit = 200;

  get isPickup(): boolean {
    return this.deliveryMethod === DeliveryMethod.Pickup;
  }

  get shippingPrice(): number {
    return this.isPickup ? 0 : this.cart.shippingPrice;
  }

  get totalPrice(): number {
    return this.cart.subtotal + this.shippingPrice;
  }

  onPlaceOrder(): void {
    if (this.loading || !this.canPlaceOrder) {
      return;
    }

    this.placeOrder.emit();
  }
}
