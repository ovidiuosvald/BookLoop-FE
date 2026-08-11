import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { UserSidebarMenuComponent } from './components/user-sidebar-menu/user-sidebar-menu.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { UserFavoritesComponent } from './components/user-favorites/user-favorites.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { SharedModule } from 'src/app/shared-components/shared.module';
import { BookModule } from '../book/book.module';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { UserAddressesComponent } from './components/user-addresses/user-addresses.component';
import { AddressDialogComponent } from './components/address-dialog/address-dialog.component';

@NgModule({
  declarations: [
    UserSidebarMenuComponent,
    UserDetailsComponent,
    UserOrdersComponent,
    UserFavoritesComponent,
    UserLayoutComponent,
    OrderDetailsComponent,
    UserAddressesComponent,
    AddressDialogComponent,
  ],
  imports: [UserRoutingModule, SharedModule, BookModule],
})
export class UserModule {}
