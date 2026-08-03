import { NgModule } from '@angular/core';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from 'src/app/shared-components/shared.module';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './components/checkout-delivery/checkout-delivery.component';
import { CheckoutBillingComponent } from './components/checkout-billing/checkout-billing.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { CheckoutSummaryComponent } from './components/checkout-summary/checkout-summary.component';
import { CheckoutSuccessComponent } from './components/checkout-success/checkout-success.component';

@NgModule({
  declarations: [CheckoutPageComponent, CheckoutAddressComponent, CheckoutDeliveryComponent, CheckoutBillingComponent, CheckoutPaymentComponent, CheckoutSummaryComponent, CheckoutSuccessComponent],
  imports: [SharedModule, CheckoutRoutingModule],
})
export class CheckoutModule {}
