import { NgModule } from '@angular/core';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CommonService } from 'src/app/services/common.service';
import { BookCarouselComponent } from './components/book-carousel/book-carousel.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component';
import { BooksRoutingModule } from './book-routing.module';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { SearchBookResultComponent } from './components/search-book/search-book-result.component';
import { SharedModule } from 'src/app/shared-components/shared.module';

@NgModule({
  declarations: [
    HomePageComponent,
    BookCarouselComponent,
    BookListComponent,
    BookDetailComponent,
    ActionButtonsComponent,
    SearchBookResultComponent,
  ],
  imports: [BooksRoutingModule, SharedModule],
  exports: [BookListComponent, ActionButtonsComponent],
  providers: [BookService, CategoryService, CommonService],
})
export class BookModule {}
