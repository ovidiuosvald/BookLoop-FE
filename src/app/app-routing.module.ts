import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/authentication/authentication.module').then(
        (module) => module.AuthenticationModule,
      ),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then(
        (module) => module.AdminModule,
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./modules/cart/cart.module').then((module) => module.CartModule),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./modules/checkout/checkout.module').then(
        (module) => module.CheckoutModule,
      ),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/user/user.module').then((module) => module.UserModule),
  },
  {
    path: 'info',
    loadChildren: () =>
      import('./modules/information-pages/information-pages.module').then(
        (module) => module.InformationPagesModule,
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/book/book.module').then((module) => module.BookModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
