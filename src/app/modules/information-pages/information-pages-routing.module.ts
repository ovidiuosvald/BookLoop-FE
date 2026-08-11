import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DeliveryAndReturnsComponent } from './delivery-and-returns/delivery-and-returns.component';

const routes: Routes = [
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'delivery-and-returns',
    component: DeliveryAndReturnsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationPagesRoutingModule {}
