import { NgModule } from '@angular/core';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartItemListComponent } from './components/cart-item-list/cart-item-list.component';
import { FreeShippingChipComponent } from './components/free-shipping-chip/free-shipping-chip.component';
import { CartCheckoutComponent } from './components/cart-checkout/cart-checkout.component';
import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from 'src/app/shared-components/shared.module';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    CartComponent,
    CartSummaryComponent,
    EmptyCartComponent,
    CartItemComponent,
    CartItemListComponent,
    FreeShippingChipComponent,
    CartCheckoutComponent,
  ],
  imports: [CartRoutingModule, SharedModule],
})
export class CartModule {}
