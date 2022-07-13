import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
  authenticate,
  authenticationFailed,
  autologin,
  logout,
  signInStart,
  signUpStart,
} from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../user.model.';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInStart),
      exhaustMap((action) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
              environment.FIREBASE_API_KEY,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              const user = handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );

              return authenticate({ user, redirect: true });
            }),
            catchError((errorRes) => {
              console.log(errorRes, 'errorRes');

              return of(
                authenticationFailed({
                  errorMessage: getErrorMessage(errorRes.error),
                })
              );
            })
          );
      })
    )
  );
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUpStart),
      exhaustMap((action) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.FIREBASE_API_KEY,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              const user = handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );

              return authenticate({ user, redirect: true });
            }),
            catchError((errorRes) => {
              return of(
                authenticationFailed({
                  errorMessage: getErrorMessage(errorRes.error),
                })
              );
            })
          );
      })
    )
  );
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autologin),
      map((action) => {
        const localUser = localStorage.getItem('userData');
        if (!localUser) {
          return { type: 'NA' };
        }
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localUser);

        const loadedUser = new UserModel(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);

          return authenticate({ user: loadedUser });
        }
        return { type: 'NA' };
      })
    )
  );
  redirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authenticate),
        tap((authenticate) => {
          if (authenticate.redirect) {
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}

function handleAuthentication(
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new UserModel(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return user;
}

function getErrorMessage(error: { error: { message: string } }): string {
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
