import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkout-section-header',
  templateUrl: './checkout-section-header.component.html',
  styleUrls: ['./checkout-section-header.component.scss'],
})
export class CheckoutSectionHeaderComponent {
  @Input() step!: number;
  @Input() title = '';
  @Input() description = '';
}
