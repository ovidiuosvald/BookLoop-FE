import { NgModule } from '@angular/core';

import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DeliveryAndReturnsComponent } from './delivery-and-returns/delivery-and-returns.component';
import { SharedModule } from '../../shared-components/shared.module';
import { InformationPagesRoutingModule } from './information-pages-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DeliveryAndReturnsComponent,
    NotFoundComponent,
  ],
  imports: [SharedModule, InformationPagesRoutingModule],
  exports: [
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DeliveryAndReturnsComponent,
    NotFoundComponent,
  ],
})
export class InformationPagesModule {}
