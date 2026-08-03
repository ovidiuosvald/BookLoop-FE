import { Component } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  cartItems: Book[] = [];

  constructor(
    private readonly commonService: CommonService,
    private readonly bookService: BookService,
  ) {
    [101, 126, 134].forEach((bookId: number) => {
      this.bookService.getBook(bookId).subscribe({
        next: (book: Book) => {
          this.cartItems.push(book);
        },
      });
    });
  }

  nextStep(): void {
    this.commonService.goToCheckout();
  }

  onRemove(itemId: number): void {
    this.cartItems = this.cartItems.filter(
      (item: Book) => item.bookId !== itemId,
    );
  }

  onQuantityChange(event: { id: number; quantity: number }): void {
    const item = this.cartItems.find((book: Book) => book.bookId === event.id);

    if (item) {
      item.quantity = event.quantity;
    }
  }

  get totalProductsPrice(): number {
    return this.cartItems.reduce(
      (total: number, item: Book) => total + item.currentPrice * item.quantity,
      0,
    );
  }
}
