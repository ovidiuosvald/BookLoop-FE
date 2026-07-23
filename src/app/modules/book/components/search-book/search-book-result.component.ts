import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-search-book-result',
  templateUrl: './search-book-result.component.html',
  styleUrls: ['./search-book-result.component.scss'],
})
export class SearchBookResultComponent {
  books: Book[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const query = params['q'];

      if (query) {
        this.loading = true;

        this.bookService.searchBooks(query).subscribe((data) => {
          this.books = data;
          this.loading = false;
        });
      }
    });
  }

  goToHome() {
    this.commonService.goToHomePage();
  }
}
