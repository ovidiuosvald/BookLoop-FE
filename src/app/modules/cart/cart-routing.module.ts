import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartCheckoutComponent } from './components/cart-checkout/cart-checkout.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  { path: '', component: CartComponent },
  {
    path: 'checkout',
    component: CartCheckoutComponent,
  },
  { path: 'summary', component: CartSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
