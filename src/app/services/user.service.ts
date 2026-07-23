import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import { CredentialsInterface } from '../models/credentials.model';
import { UserInterface } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly userStorageKey = 'user';

  private readonly isUserLoggedInSubject = new BehaviorSubject<boolean>(false);

  private readonly authenticatedUserSubject =
    new BehaviorSubject<UserInterface>({
      firstName: '',
      lastName: '',
    });

  readonly isUserLoggedIn$: Observable<boolean> =
    this.isUserLoggedInSubject.asObservable();

  readonly authenticatedUser$: Observable<UserInterface> =
    this.authenticatedUserSubject.asObservable();

  get authenticatedUser(): UserInterface {
    return this.authenticatedUserSubject.value;
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly commonService: CommonService,
  ) {
    this.restoreUserFromStorage();
  }

  createUserUsingPOST(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.post<UserInterface>(
      `${this.baseUrl}/user/register`,
      user,
      {
        withCredentials: true,
      },
    );
  }

  changePasswordUsingPUT(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.baseUrl}/user/change-password`,
      user,
      {
        withCredentials: true,
      },
    );
  }

  forgotPasswordUsingPOST(email: string): Observable<void> {
    return this.httpClient.post<void>(
      `${this.baseUrl}/user/forgot-password`,
      {
        email,
      },
      {
        withCredentials: true,
      },
    );
  }

  updateUserUsingPUT(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.baseUrl}/user/update`,
      user,
      {
        withCredentials: true,
      },
    );
  }

  getUserByEmailUsingGET(email: string): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(
      `${this.baseUrl}/user/get-user-by-email/${encodeURIComponent(email)}`,
      {
        withCredentials: true,
      },
    );
  }

  loginUsingPOST(
    credentials: CredentialsInterface,
  ): Observable<HttpResponse<string>> {
    const body = new HttpParams()
      .set('username', credentials.email.trim())
      .set('password', credentials.password);

    return this.httpClient.post(`${this.baseUrl}/login`, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      observe: 'response',
      responseType: 'text',
      withCredentials: true,
    });
  }

  logoutUsingPOST(): void {
    this.httpClient
      .post<void>(
        `${this.baseUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: () => this.logout(),
        error: () =>
          this.commonService.showSnackBarError(
            'Delogarea nu a putut fi realizată.',
          ),
      });
  }

  getUser(email: string): void {
    this.getUserByEmailUsingGET(email).subscribe({
      next: (user: UserInterface) => {
        this.setAuthenticatedUser(user);
        this.commonService.goToHomePage();
      },
      error: () =>
        this.commonService.showSnackBarError(
          'Datele utilizatorului nu au putut fi încărcate.',
        ),
    });
  }

  updateAuthenticatedUser(user: UserInterface): void {
    this.setAuthenticatedUser(user);
  }

  private setAuthenticatedUser(user: UserInterface): void {
    this.authenticatedUserSubject.next(user);
    this.isUserLoggedInSubject.next(true);
    this.setUserInStorage(user);
  }

  private logout(): void {
    this.authenticatedUserSubject.next({
      firstName: '',
      lastName: '',
    });

    this.isUserLoggedInSubject.next(false);
    this.removeUserFromStorage();
    this.commonService.goToHomePage();
  }

  private restoreUserFromStorage(): void {
    const storedUser = window.localStorage.getItem(this.userStorageKey);

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser) as UserInterface;

      this.authenticatedUserSubject.next(user);
      this.isUserLoggedInSubject.next(true);
    } catch {
      this.removeUserFromStorage();
    }
  }

  private setUserInStorage(user: UserInterface): void {
    window.localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    window.localStorage.removeItem(this.userStorageKey);
  }
}
