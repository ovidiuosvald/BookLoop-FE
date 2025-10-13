export interface Book {
  bookId: string;
  bookName: string;
  author: string;
  currentPrice: number;
  coverUrl: string;
  category: string;
  quantity: number;
  description: string;
  isNew: boolean;
  isBestseller: boolean;
  isFavorite: boolean;
  giftWrap?: boolean;
  promoImageUrl?: string;
}
