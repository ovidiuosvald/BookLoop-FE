import { NgModule } from '@angular/core';
import { ProductsComponent } from './components/products/products.component';
import { CartRoutingModule } from './cart-routing.module';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartItemListComponent } from './components/cart-item-list/cart-item-list.component';
import { FreeShippingChipComponent } from './components/free-shipping-chip/free-shipping-chip.component';
import { CartCheckoutComponent } from './components/cart-checkout/cart-checkout.component';
import { SharedModule } from 'src/app/shared-components/shared.module';

@NgModule({
  declarations: [
    ProductsComponent,
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
