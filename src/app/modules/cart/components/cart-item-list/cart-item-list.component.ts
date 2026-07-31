import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-cart-item-list',
  templateUrl: './cart-item-list.component.html',
  styleUrls: ['./cart-item-list.component.scss'],
})
export class CartItemListComponent {
  @Input() cartItems: Book[] = [];

  @Output() remove = new EventEmitter<number>();
  @Output() quantityChange = new EventEmitter<{
    id: number;
    quantity: number;
  }>();
  @Output() giftWrapChange = new EventEmitter<boolean>();

  onRemove(id: number) {
    this.remove.emit(id);
  }

  onQuantityChange(event: { id: number; quantity: number }) {
    this.quantityChange.emit(event);
  }
}
