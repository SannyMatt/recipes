import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from './user.model.';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
const FB_API_KEY = environment.FIREBASE_API_KEY;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;
  userStatus = new BehaviorSubject<UserModel | null>(null);
  constructor(private http: HttpClient, private router: Router) {}

  private getErrorMessage(error: { error: { message: string } }): string {
    let errorMessage = 'An Error occured';

    const responseErrorMessage = error?.error?.message;
    switch (responseErrorMessage) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists Already';
        break;
      default:
        errorMessage = responseErrorMessage;
    }

    return errorMessage;
  }
  signUp(email: string, password: string) {
    return this.fetchFireBaseAuth({
      url:
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        FB_API_KEY,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.fetchFireBaseAuth({
      url:
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        FB_API_KEY,
      email,
      password,
    });
  }
  autoLogin() {
    const user = localStorage.getItem('userData');
    if (!user) {
      return;
    }

    const parsedUser: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(user);

    const { email, id, _token, _tokenExpirationDate } = parsedUser;
    const loadedUser = new UserModel(
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userStatus.next(loadedUser);

      const expirationDuration =
        new Date(_tokenExpirationDate).getTime() - new Date().getTime();
      this.autlogout(expirationDuration);
    }
  }
  logout() {
    this.userStatus.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autlogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  handleUserMetaSet(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: string
  ) {
    const expiresInCalculated = +expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInCalculated);
    const user = new UserModel(email, localId, idToken, expirationDate);
    this.userStatus.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autlogout(expiresInCalculated);
  }

  private fetchFireBaseAuth({
    url,
    email,
    password,
  }: {
    url: string;
    email: string;
    password: string;
  }) {
    return this.http
      .post<AuthResponseData>(url, { email, password, returnSecureToken: true })
      .pipe(
        catchError((errorRes) => {
          if (errorRes?.error?.error?.message) {
            let errorMessage = this.getErrorMessage(errorRes?.error);

            return throwError(() => errorMessage);
          }
          return throwError(() => errorRes.message);
        }),
        tap((resData) => {
          const { email, localId, idToken, expiresIn } = resData;
          this.handleUserMetaSet(email, localId, idToken, expiresIn);
        })
      );
  }
}
