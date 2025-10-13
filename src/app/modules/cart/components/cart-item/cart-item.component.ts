import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: Book;
  @Input() showGiftWrapOption = false;
  @Input() giftWrapSelected = false;

  @Output() remove = new EventEmitter<string>(); // emit id
  @Output() quantityChange = new EventEmitter<{
    id: string;
    quantity: number;
  }>();
  @Output() giftWrapChange = new EventEmitter<boolean>();

  onRemove() {
    this.remove.emit(this.item.bookId);
  }

  getTotalPrice(): number {
    return this.item.quantity * this.item.currentPrice;
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = Number(input.value);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.item.quantity = newQuantity;
      this.quantityChange.emit({
        id: this.item.bookId, // trimitem doar id și quantity
        quantity: this.item.quantity,
      });
    } else {
      input.value = String(this.item.quantity);
    }
  }

  onGiftWrapToggle() {
    this.giftWrapChange.emit(!this.giftWrapSelected);
  }
}
