import { Order } from './order.model';

export interface AdminDashboard {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;

  placedOrders: number;
  lowStockProducts: number;

  recentOrders: Order[];
}
