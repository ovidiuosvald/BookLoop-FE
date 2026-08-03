export interface CartItem {
  cartItemId: number;
  bookId: number;
  bookName: string;
  author: string;
  currentPrice: number;
  coverUrl: string;
  quantity: number;
  availableQuantity: number;
  isNew: boolean;
  isBestseller: boolean;
  isFavorite: boolean;
  subtotal: number;
}
