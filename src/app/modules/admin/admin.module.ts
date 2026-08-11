import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminContainerComponent } from './components/admin-container/admin-container.component';
import { SharedModule } from 'src/app/shared-components/shared.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProductFormComponent } from './components/admin-product-form/admin-product-form.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { UserRoleDialogComponent } from './components/user-role-dialog/user-role-dialog.component';
import { OrderStatusDialogComponent } from './components/order-status-dialog/order-status-dialog.component';
import { AdminOrderDetailsComponent } from './components/admin-order-details/admin-order-details.component';

@NgModule({
  declarations: [
    AdminContainerComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminUsersComponent,
    AdminProductFormComponent,
    AdminCategoriesComponent,
    CategoryDialogComponent,
    UserRoleDialogComponent,
    OrderStatusDialogComponent,
    AdminOrderDetailsComponent,
  ],
  imports: [SharedModule, AdminRoutingModule],
})
export class AdminModule {}
