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

  constructor(
    private commonService: CommonService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const sub = this.bookService.getAllBookssUsingGET().subscribe({
      next: (books: Book[]) => {
        this.promoBooks = books.filter((b) => !!b.promoImageUrl);
        this.newBooks = books.filter((b) => b.isNew);
      },
      error: () =>
        this.commonService.showSnackBarError('Nu s-au putut încărca cărțile!'),
    });
    this.subscriptionList.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
