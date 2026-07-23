import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';
@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  public isUserLoggedIn: boolean = false;
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    this.userService.isUserLoggedIn$.subscribe({
      next: (value: boolean) => (this.isUserLoggedIn = value),
    });

    if (!this.isUserLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
        queryParamsHandling: 'merge',
      });

      return false;
    }

    return true;
  }

  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    return this.canActivate(route, state);
  }
}
