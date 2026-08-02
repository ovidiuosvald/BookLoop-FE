import { Category } from './category.model';

export interface Book {
  bookId: number;
  bookName: string;
  author: string;
  currentPrice: number;
  coverUrl: string;
  category: string | Category;
  quantity: number;
  description: string;
  isNew: boolean;
  isBestseller: boolean;
  isFavorite: boolean;
  giftWrap?: boolean;
  promoImageUrl?: string;
}
