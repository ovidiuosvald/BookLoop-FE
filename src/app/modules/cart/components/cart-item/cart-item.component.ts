import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CartItem } from 'src/app/models/cart-item.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: CartItem;

  @Output() remove = new EventEmitter<number>();

  @Output() quantityChange = new EventEmitter<{
    bookId: number;
    quantity: number;
  }>();

  @Output() moveToFavorites = new EventEmitter<number>();

  constructor(private readonly commonService: CommonService) {}

  onRemove(): void {
    this.remove.emit(this.item.bookId);
  }

  onMoveToFavorites(): void {
    this.moveToFavorites.emit(this.item.bookId);
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Permitem câmpul gol temporar, ca utilizatorul să poată scrie.
    if (input.value.trim() === '') {
      return;
    }

    const requestedQuantity = Number(input.value);

    if (requestedQuantity > this.item.availableQuantity) {
      input.value = String(this.item.availableQuantity);

      this.commonService.showSnackBarWarning(
        `Sunt disponibile doar ${this.item.availableQuantity} exemplare.`,
      );
    }
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.value.trim() === '') {
      input.value = String(this.item.quantity);

      this.commonService.showSnackBarWarning('Introdu o cantitate validă.');
      return;
    }

    const requestedQuantity = Number(input.value);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      input.value = String(this.item.quantity);

      this.commonService.showSnackBarWarning(
        'Cantitatea trebuie să fie de cel puțin 1.',
      );
      return;
    }

    if (requestedQuantity > this.item.availableQuantity) {
      input.value = String(this.item.availableQuantity);

      this.commonService.showSnackBarWarning(
        `Sunt disponibile doar ${this.item.availableQuantity} exemplare.`,
      );
      return;
    }

    if (requestedQuantity === this.item.quantity) {
      return;
    }

    this.quantityChange.emit({
      bookId: this.item.bookId,
      quantity: requestedQuantity,
    });
  }
}
