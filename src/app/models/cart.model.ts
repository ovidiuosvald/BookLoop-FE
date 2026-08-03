import { CartItem } from './cart-item.model';

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
}
