import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent {
  categoryCode!: string;
  books: Book[] = [];

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const navigation = this.router.getCurrentNavigation();
      const isBestseller =
        navigation?.extras.state?.isBestseller || history.state.isBestseller;
      const categoryCode = params.get('categoryCode');
      if (isBestseller) {
        this.loadBestsellers();
      } else if (categoryCode) {
        this.categoryCode = categoryCode;
        this.loadBooksByCategoryCode(categoryCode);
      }
    });
  }

  loadBestsellers(): void {
    this.bookService.getBestsellersUsingGET().subscribe((books: Book[]) => {
      this.books = books;
    });
  }

  loadBooksByCategoryCode(categoryCode: string): void {
    this.bookService
      .getBooksByCategoryCodeUsingGET(categoryCode)
      .subscribe((books) => {
        this.books = books;
      });
  }

  addToCart(book: Book) {
    console.log(`${book.bookName} adăugat în coș.`);
  }

  toggleFavorite(book: Book) {
    book.isFavorite = !book.isFavorite;
  }

  goToSpecificBook(bookId: string) {
    this.commonService.goToSpecificBook(bookId);
  }
}
