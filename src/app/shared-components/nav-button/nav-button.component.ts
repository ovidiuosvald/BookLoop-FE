import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.scss'],
})
export class NavButtonComponent {
  @Input() text: string = 'Buton';
  @Input() icon: string = 'arrow_forward'; // default icon
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
