import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-free-shipping-chip',
  templateUrl: './free-shipping-chip.component.html',
  styleUrls: ['./free-shipping-chip.component.scss'],
})
export class FreeShippingChipComponent {
  @Input() total: number = 0;
  readonly freeShippingLimit = 200;

  get isFreeShipping(): boolean {
    return this.total >= this.freeShippingLimit;
  }

  get difference(): number {
    return Math.max(0, this.freeShippingLimit - this.total);
  }
}
