import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { UserFavoritesComponent } from './components/user-favorites/user-favorites.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';

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
        path: 'orders',
        component: UserOrdersComponent,
      },
      {
        path: 'favorites',
        component: UserFavoritesComponent,
      },
      {
        path: 'reviews',
        component: UserReviewsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
