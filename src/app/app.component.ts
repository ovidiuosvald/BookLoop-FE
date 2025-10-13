import { UserService } from './services/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'BookStore';
  public isUserLoggedIn$?: Observable<boolean>;

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.isUserLoggedIn$ = this._userService.isUserLoggedIn$;
  }
}
