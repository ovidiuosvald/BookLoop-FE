import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { UserFavoritesComponent } from './components/user-favorites/user-favorites.component';

const routes: Routes = [
  { path: 'account', component: UserDetailsComponent },
  { path: 'orders', component: UserOrdersComponent },
  { path: 'favorites', component: UserFavoritesComponent },
  // { path: 'logout', component: UserLogoutComponent } // dacă ai nevoie
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
