import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-cart',
  templateUrl: './empty-cart.component.html',
  styleUrls: ['./empty-cart.component.scss'],
})
export class EmptyCartComponent {
  @Output() goHome = new EventEmitter<void>();

  onGoHome() {
    this.goHome.emit();
  }
}
