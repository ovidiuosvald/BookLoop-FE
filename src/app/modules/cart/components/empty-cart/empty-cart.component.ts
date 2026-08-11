import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-empty-cart',
  templateUrl: './empty-cart.component.html',
  styleUrls: ['./empty-cart.component.scss'],
})
export class EmptyCartComponent {
  @Output() goHome = new EventEmitter<void>();

  onGoHome(): void {
    this.goHome.emit();
  }
}
