import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products/products.component';
import { CartRoutingModule } from './cart-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { NavButtonComponent } from './components/nav-button/nav-button.component';
import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartItemListComponent } from './components/cart-item-list/cart-item-list.component';
import { FreeShippingChipComponent } from './components/free-shipping-chip/free-shipping-chip.component';
import { CartCheckoutComponent } from './components/cart-checkout/cart-checkout.component';

@NgModule({
  declarations: [
    ProductsComponent,
    CartSummaryComponent,
    NavButtonComponent,
    EmptyCartComponent,
    CartItemComponent,
    CartItemListComponent,
    FreeShippingChipComponent,
    CartCheckoutComponent,
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CartModule {}
