import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private subscriptionList: Subscription[] = [];
  promoBooks: Book[] = [];
  newBooks: Book[] = [];
  bestsellerBooks: Book[] = [];

  constructor(
    private commonService: CommonService,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    const sub = this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.promoBooks = books.filter((book) => !!book.promoImageUrl);

        this.newBooks = books.filter((book) => book.isNew);

        this.bestsellerBooks = books.filter((book) => book.isBestseller);
      },
      error: () =>
        this.commonService.showSnackBarError('Nu s-au putut încărca cărțile!'),
    });
    this.subscriptionList.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  }

  goToAllBooks(): void {
    this.commonService.goToAllBooks();
  }

  goToBestsellers(): void {
    this.commonService.goToBestsellers();
  }
}
