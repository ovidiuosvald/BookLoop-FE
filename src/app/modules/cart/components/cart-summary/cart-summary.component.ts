import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  @Input() cartItems: Book[] = [];
  @Input() shippingPrice: number = 0;

  get totalProductsPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.currentPrice * item.quantity,
      0
    );
  }

  get totalPrice(): number {
    return this.totalProductsPrice + this.shippingPrice;
  }
}
