import { Category } from './category.model';

export interface Book {
  bookId: number;
  bookName: string;
  author: string;
  publisher?: string;
  numberOfPages?: number;
  yearOfPublication?: number;
  currentPrice: number;
  coverUrl: string;
  promoImageUrl?: string;
  quantity: number;
  description: string;
  category: string | Category;
  isNew: boolean;
  isBestseller: boolean;
  isFavorite: boolean;
  lastModifiedDate?: string;
}
