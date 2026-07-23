import { HttpClient, HttpResponse } from '@angular/common/http';
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
    );
  }

  changePasswordUsingPUT(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.baseUrl}/user/change-password`,
      user,
    );
  }

  updateUserUsingPUT(user: UserInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(
      `${this.baseUrl}/user/update`,
      user,
    );
  }

  getUserByEmailUsingGET(email: string): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(
      `${this.baseUrl}/user/get-user-by-email/${encodeURIComponent(email)}`,
    );
  }

  loginUsingPOST(
    credentials: CredentialsInterface,
  ): Observable<HttpResponse<string>> {
    const formData = new FormData();

    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return this.httpClient.post(`${this.baseUrl}/login`, formData, {
      observe: 'response',
      responseType: 'text',
    });
  }

  logoutUsingPOST(): void {
    this.httpClient.post<void>(`${this.baseUrl}/logout`, {}).subscribe({
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
    this.commonService.goToLoginPage();
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
