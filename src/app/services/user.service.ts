import { CommonService } from 'src/app/services/common.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInterface } from '../models/user.model';
import { CredentialsInterface } from '../models/credentials.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _baseUrl: string = 'http://localhost:8080';
  private _isUserLoggedIn$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _authenticatedUser$: BehaviorSubject<UserInterface> =
    new BehaviorSubject<UserInterface>({ username: '' });

  public authenticatedUser$: Observable<UserInterface>;
  public isUserLoggedIn$: Observable<boolean>;

  public get authenticatedUser() {
    return this._authenticatedUser$.value;
  }

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService
  ) {
    this.authenticatedUser$ = this._authenticatedUser$.asObservable();
    this.isUserLoggedIn$ = this._isUserLoggedIn$.asObservable();

    const userFromStorage = window.localStorage.getItem('user');

    if (!!userFromStorage) {
      this._isUserLoggedIn$.next(true);

      this._authenticatedUser$.next(JSON.parse(userFromStorage!));
    } else {
      this._isUserLoggedIn$.next(false);
    }
  }

  public createUserUsingPOST(user: UserInterface): Observable<UserInterface> {
    return this._httpClient.post(
      `${this._baseUrl}/user/register`,
      user
    ) as Observable<UserInterface>;
  }
  public changePasswordUsingPUT(
    user: UserInterface
  ): Observable<UserInterface> {
    return this._httpClient.put(
      `${this._baseUrl}/user/change-password`,
      user
    ) as Observable<UserInterface>;
  }

  public updateUserUsingPUT(user: UserInterface): Observable<UserInterface> {
    return this._httpClient.put(
      `${this._baseUrl}/user/update`,
      user
    ) as Observable<UserInterface>;
  }
  public getUserByEmailUsingGET(email: string): Observable<UserInterface> {
    return this._httpClient.get(
      `${this._baseUrl}/user/get-user-by-email/${email}`
    ) as Observable<UserInterface>;
  }

  public loginUsingPOST(
    credentials: CredentialsInterface
  ): Observable<HttpResponse<string>> {
    const formData = new FormData();

    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return this._httpClient.post(
      `${this._baseUrl}/login`,
      formData
    ) as Observable<HttpResponse<string>>;
  }

  public logoutUsingPOST() {
    this._httpClient.post(`${this._baseUrl}/logout`, {}).subscribe({
      next: () => this._logout(),
    });
  }

  public getUser(email: string) {
    this.getUserByEmailUsingGET(email).subscribe({
      next: (user: UserInterface) => {
        this._authenticatedUser$.next(user);
        this._isUserLoggedIn$.next(true);
        this._setLocalStorageKey(email, user);
        this._commonService.goToHomePage();
      },
      error: () =>
        this._commonService.showSnackBarError(
          'Failed to get user information!'
        ),
    });
  }

  private _logout() {
    this._authenticatedUser$.next({ username: '' });
    this._isUserLoggedIn$.next(false);
    this._removeLocalStorageKey();
    this._commonService.goToLoginPage();
  }

  private _removeLocalStorageKey(): void {
    window.localStorage.removeItem('user');
  }

  private _setLocalStorageKey(email: string, user: UserInterface): void {
    window.localStorage.setItem('user', JSON.stringify(user));
  }
}
