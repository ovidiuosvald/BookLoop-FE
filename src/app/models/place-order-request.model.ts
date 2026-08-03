import {
  BillingType,
  DeliveryMethod,
  PaymentMethod,
} from '../enums/order.enums';
import { Address } from './address.model';
import { CompanyDetails } from './company-details.model';

export interface PlaceOrderRequest {
  addressId?: number;

  saveDeliveryAddress: boolean;
  billingSameAsDelivery: boolean;

  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  billingType: BillingType;

  deliveryAddress?: Address;
  billingAddress?: Address;
  companyDetails?: CompanyDetails;
}
