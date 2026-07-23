import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { SearchBookResultComponent } from './components/search-book/search-book-result.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  { path: 'books/bestsellere', component: BookListComponent },
  { path: 'books/:categoryCode', component: BookListComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'search', component: SearchBookResultComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
