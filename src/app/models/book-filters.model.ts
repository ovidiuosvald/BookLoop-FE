export type BookSortOption =
  | 'priceAsc'
  | 'priceDesc'
  | 'titleAsc'
  | 'titleDesc';

export interface BookFilters {
  q?: string;
  categoryCode?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  sort?: BookSortOption;
}
