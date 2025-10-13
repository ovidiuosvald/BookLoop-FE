import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-book-carousel',
  templateUrl: './book-carousel.component.html',
  styleUrls: ['./book-carousel.component.scss'],
})
export class BookCarouselComponent {
  @Input() books: Book[] = [];
  @Input() mode: 'single' | 'multi' = 'single'; // single = imagine mare, multi = 5 cărți
  currentSlide = 0;

  constructor(private commonService: CommonService) {}

  nextSlide(): void {
    const maxIndex =
      this.mode === 'multi' ? this.books.length - 5 : this.books.length - 1;
    if (this.currentSlide < maxIndex) this.currentSlide++;
  }

  prevSlide(): void {
    if (this.currentSlide > 0) this.currentSlide--;
  }

  goToSpecificBook(bookId: string): void {
    this.commonService.goToSpecificBook(bookId);
  }
}
