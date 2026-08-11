import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.scss'],
})
export class NavButtonComponent {
  @Input() text = 'Buton';
  @Input() icon = 'arrow_forward';
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.clicked.emit();
  }
}
