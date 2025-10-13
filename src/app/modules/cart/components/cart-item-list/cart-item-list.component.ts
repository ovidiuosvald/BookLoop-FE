import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-cart-item-list',
  templateUrl: './cart-item-list.component.html',
  styleUrls: ['./cart-item-list.component.scss'],
})
export class CartItemListComponent {
  @Input() cartItems: Book[] = [];

  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{
    id: string;
    quantity: number;
  }>();
  @Output() giftWrapChange = new EventEmitter<boolean>();

  onRemove(id: string) {
    this.remove.emit(id);
  }

  onQuantityChange(event: { id: string; quantity: number }) {
    this.quantityChange.emit(event);
  }
}
