import { Address } from './address.model';
import { CompanyDetails } from './company-details.model';
import { OrderItem } from './order-item.model';
import {
  BillingType,
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
} from '../enums/order.enums';

export interface Order {
  orderId: number;
  userId: number;
  items: OrderItem[];

  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  billingType: BillingType;

  deliveryAddress: Address;
  billingAddress?: Address;
  companyDetails?: CompanyDetails;

  subtotal: number;
  shippingCost: number;
  totalPrice: number;

  creationDate: string;
}
