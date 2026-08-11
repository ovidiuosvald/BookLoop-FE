import { OrderStatus } from '../enums/order.enums';

export interface AdminOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: OrderStatus;
  creationDate: string;
  lastModifiedDate: string;
}
