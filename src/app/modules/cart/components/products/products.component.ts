import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private commonService: CommonService,
    private bookService: BookService,
    private router: Router
  ) {
    ['101', '126', '134'].forEach((id) => {
      this.bookService.getBookByBookIdUsingGET(id).subscribe((book) => {
        next: this.cartItems.push(book);
      });
    });
  }

  nextStep() {
    this.commonService.gotToCheckout();
  }

  onRemove(itemId: string) {
    this.cartItems = this.cartItems.filter((item) => item.bookId !== itemId);
  }

  onQuantityChange(event: { id: string; quantity: number }) {
    const item = this.cartItems.find((i) => i.bookId === event.id);
    if (item) {
      item.quantity = event.quantity;
    }
  }

  get totalProductsPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.currentPrice * item.quantity,
      0
    );
  }
}
