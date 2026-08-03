import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CredentialsInterface } from '../models/credentials.model';
import { UserInterface } from '../models/user.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080';
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

  registerUser(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.post<UserInterface>(
      `${this.apiUrl}/user/register`,
      user,
      {
        withCredentials: true,
      },
    );
  }

  changePassword(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.apiUrl}/user/change-password`,
      user,
      {
        withCredentials: true,
      },
    );
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.httpClient.post<void>(
      `${this.apiUrl}/user/forgot-password`,
      { email },
      {
        withCredentials: true,
      },
    );
  }

  updateUser(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.apiUrl}/user/update`,
      user,
      {
        withCredentials: true,
      },
    );
  }

  getUserByEmail(email: string): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(
      `${this.apiUrl}/user/get-user-by-email/${encodeURIComponent(email)}`,
      {
        withCredentials: true,
      },
    );
  }

  login(credentials: CredentialsInterface): Observable<HttpResponse<string>> {
    const body = new HttpParams()
      .set('username', credentials.email.trim())
      .set('password', credentials.password);

    return this.httpClient.post(`${this.apiUrl}/login`, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      observe: 'response',
      responseType: 'text',
      withCredentials: true,
    });
  }

  logout(): void {
    this.httpClient
      .post<void>(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: () => {
          this.clearAuthenticatedUser();
        },
        error: () => {
          this.commonService.showSnackBarError(
            'Delogarea nu a putut fi realizată.',
          );
        },
      });
  }

  loadAuthenticatedUser(email: string): void {
    this.getUserByEmail(email).subscribe({
      next: (user: UserInterface) => {
        this.setAuthenticatedUser(user);
        this.commonService.goToHomePage();
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Datele utilizatorului nu au putut fi încărcate.',
        );
      },
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

  private clearAuthenticatedUser(): void {
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

      if (
        !user ||
        typeof user !== 'object' ||
        typeof user.userId !== 'number'
      ) {
        this.removeUserFromStorage();
        return;
      }

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
