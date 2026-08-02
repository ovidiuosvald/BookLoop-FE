import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-multi-book-carousel',
  templateUrl: './multi-book-carousel.component.html',
  styleUrls: ['./multi-book-carousel.component.scss'],
})
export class MultiBookCarouselComponent {
  @Input() books: Book[] = [];

  readonly visibleBooks = 5;

  currentSlide = 0;

  constructor(private readonly commonService: CommonService) {}

  get maxSlideIndex(): number {
    return Math.max(0, this.books.length - this.visibleBooks);
  }

  nextSlide(): void {
    if (this.currentSlide < this.maxSlideIndex) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  getTrackTransform(): string {
    return `translateX(-${this.currentSlide * 20}%)`;
  }

  goToSpecificBook(bookId: number): void {
    this.commonService.goToSpecificBook(bookId);
  }
}
