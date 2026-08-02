import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() compact = false;
  @Input() showActions = true;

  @Output() openBook = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<Book>();
  @Output() toggleFavorite = new EventEmitter<Book>();

  onOpenBook(): void {
    this.openBook.emit(this.book.bookId);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.book);
  }

  onToggleFavorite(): void {
    this.toggleFavorite.emit(this.book);
  }

  getCategoryName(category: string | Category): string {
    return typeof category === 'string' ? category : category.categoryName;
  }
}
