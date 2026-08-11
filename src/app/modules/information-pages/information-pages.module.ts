import { NgModule } from '@angular/core';

import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DeliveryAndReturnsComponent } from './delivery-and-returns/delivery-and-returns.component';
import { SharedModule } from '../../shared-components/shared.module';
import { InformationPagesRoutingModule } from './information-pages-routing.module';

@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DeliveryAndReturnsComponent,
  ],
  imports: [SharedModule, InformationPagesRoutingModule],
  exports: [
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DeliveryAndReturnsComponent,
  ],
})
export class InformationPagesModule {}
