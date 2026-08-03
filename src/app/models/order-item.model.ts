export interface OrderItem {
  orderItemId: number;
  bookId: number;
  bookName: string;
  coverUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
