import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent {
  @Input() isFavorite = false;

  @Input() showCartButton = true;
  @Input() favoriteButtonText = 'Favorite';

  @Output() addToCart = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();

  onAddToCart(): void {
    this.addToCart.emit();
  }

  onToggleFavorite(): void {
    this.toggleFavorite.emit();
  }
}
