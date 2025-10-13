import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { UserSidebarMenuComponent } from './components/user-sidebar-menu/user-sidebar-menu.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { UserFavoritesComponent } from './components/user-favorites/user-favorites.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';

@NgModule({
  declarations: [
    UserSidebarMenuComponent,
    UserDetailsComponent,
    UserOrdersComponent,
    UserFavoritesComponent,
    UserLayoutComponent,
  ],
  imports: [CommonModule, UserRoutingModule, RouterModule, MaterialModule],
})
export class UserModule {}
