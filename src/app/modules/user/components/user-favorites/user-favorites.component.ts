import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss'],
})
export class UserFavoritesComponent implements OnInit {
  favoriteBooks: Book[] = [];

  ngOnInit(): void {
    // aici vom încărca favoritele din service
  }
}
