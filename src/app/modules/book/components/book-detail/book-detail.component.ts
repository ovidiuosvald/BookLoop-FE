import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  book!: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookByBookIdUsingGET(id).subscribe((book) => {
        this.book = book;
      });
    }
  }

  toggleFavorite() {
    this.book.isFavorite = !this.book.isFavorite;
  }

  addToCart() {
    // logica de adăugat în coș
    alert(`${this.book.bookName} a fost adăugat în coș!`);
  }
}
