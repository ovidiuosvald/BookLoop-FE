import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { UserAddressesComponent } from './components/user-addresses/user-addresses.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserFavoritesComponent } from './components/user-favorites/user-favorites.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        component: UserDetailsComponent,
      },
      {
        path: 'addresses',
        component: UserAddressesComponent,
      },
      {
        path: 'orders',
        component: UserOrdersComponent,
      },
      {
        path: 'orders/:orderId',
        component: OrderDetailsComponent,
      },
      {
        path: 'favorites',
        component: UserFavoritesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
