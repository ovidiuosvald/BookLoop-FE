import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, map, Observable, of, take } from 'rxjs';

import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    const userId = this.userService.authenticatedUser?.userId;

    if (!userId) {
      return of(
        this.router.createUrlTree(['/auth/login'], {
          queryParams: {
            returnUrl: state.url,
          },
        }),
      );
    }

    return this.cartService.getCart(userId).pipe(
      take(1),
      map((cart) => {
        if (cart.items?.length > 0) {
          return true;
        }

        return this.router.createUrlTree(['/cart']);
      }),
      catchError(() => of(this.router.createUrlTree(['/cart']))),
    );
  }
}
