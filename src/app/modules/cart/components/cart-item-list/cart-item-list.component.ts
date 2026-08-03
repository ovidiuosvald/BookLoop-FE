import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-cart-item-list',
  templateUrl: './cart-item-list.component.html',
  styleUrls: ['./cart-item-list.component.scss'],
})
export class CartItemListComponent {
  @Input() cartItems: CartItem[] = [];

  @Output() remove = new EventEmitter<number>();

  @Output() quantityChange = new EventEmitter<{
    bookId: number;
    quantity: number;
  }>();

  @Output() moveToFavorites = new EventEmitter<number>();

  onRemove(bookId: number): void {
    this.remove.emit(bookId);
  }

  onQuantityChange(event: { bookId: number; quantity: number }): void {
    this.quantityChange.emit(event);
  }

  onMoveToFavorites(bookId: number): void {
    this.moveToFavorites.emit(bookId);
  }
}
