import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  showHeader = true;
  showFooter = true;

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        const hideLayout =
          url.startsWith('/auth') ||
          url.startsWith('/admin') ||
          url.startsWith('/info/not-found');

        this.showHeader = !hideLayout;
        this.showFooter = !hideLayout;
      });
  }
}
