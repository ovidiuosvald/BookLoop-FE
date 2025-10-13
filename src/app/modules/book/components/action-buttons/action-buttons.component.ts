import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent {
  @Input() isFavorite = false;
  @Output() addToCart = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();

  onAddToCart() {
    this.addToCart.emit();
  }

  onToggleFavorite() {
    this.toggleFavorite.emit();
  }
}
