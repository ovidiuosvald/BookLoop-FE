import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
// import { UserGuard } from 'src/app/guards/login.guard';
import { MaterialModule } from '../material.module';
import { BookCarouselComponent } from './components/book-carousel/book-carousel.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component';
import { BooksRoutingModule } from './book-routing.module';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';

@NgModule({
  declarations: [
    HomePageComponent,
    BookCarouselComponent,
    BookListComponent,
    BookDetailComponent,
    ActionButtonsComponent,
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [BookService, CategoryService, CommonService],
})
export class BookModule {}
