import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-promo-book-carousel',
  templateUrl: './promo-book-carousel.component.html',
  styleUrls: ['./promo-book-carousel.component.scss'],
})
export class PromoBookCarouselComponent {
  @Input() books: Book[] = [];

  currentSlide = 0;

  constructor(private readonly commonService: CommonService) {}

  nextSlide(): void {
    if (this.currentSlide < this.books.length - 1) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }
}
