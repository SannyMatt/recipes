import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
  authenticate,
  authenticationFailed,
  autologin,
  checkSession,
  logout,
  signInStart,
  signInWithSIP,
  signOut,
  signOutFail,
  signOutSuccess,
  signUpStart,
  signUpSuccess,
} from './auth.actions';
import { catchError, exhaustMap, from, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../user.model.';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
export interface SignUpUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface AuthResponseCognitoData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

// () =>
//   this.actions$.pipe(
//     ofType(signUpStart),
//     exhaustMap((action) => {
//       return this.http
//         .post<AuthResponseData>(
//           'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
//             environment.FIREBASE_API_KEY,
//           {
//             email: action.email,
//             password: action.password,
//             returnSecureToken: true,
//           }
//         )
//         .pipe(
//           map((resData) => {
//             const user = handleAuthentication(
//               +resData.expiresIn,
//               resData.email,
//               resData.localId,
//               resData.idToken
//             );

//             return authenticate({ user, redirect: true });
//           }),
//           catchError((errorRes) => {
//             return of(
//               authenticationFailed({
//                 errorMessage: getErrorMessage(errorRes.error),
//               })
//             );
//           })
//         );
//     })
//   );
@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInStart),
      exhaustMap((actions) => {
        return from(Auth.signIn(actions.email, actions.password)).pipe(
          map((user: CognitoUser) => {
            console.log(user, 'USER I NEED');

            const authedUser = new UserModel('e', 'e', 'e', new Date());
            return authenticate({ user: authedUser });
          }),
          catchError((errorRes) => {
            return of(
              authenticationFailed({
                errorMessage: getErrorMessage(errorRes),
              })
            );
          })
        );
      })
    )
  );
  loginSocialIdentityProvider$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInWithSIP),
      exhaustMap((action) => {
        action.provider;
        return from(
          Auth.federatedSignIn({
            provider: action.provider,
          })
        ).pipe(
          map((socialResult) => {
            console.log(socialResult, 'socialResult');

            return { type: ' ' };
          })
        );
      })
    )
  );

  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signOut),
      exhaustMap(() => {
        return from(Auth.signOut()).pipe(
          map(() => {
            return signOutSuccess();
          }),
          catchError((error) => {
            let errorMessage = 'An unknown error occured';
            console.warn('Error on sign out: ', error);

            if (error instanceof Error) {
              errorMessage = error.message;
            }

            return of(signOutFail({ errorMessage }));
          })
        );
      })
    )
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUpStart),
      exhaustMap((action) => {
        return from(
          Auth.signUp({
            username: action.email,
            password: action.password,
            attributes: {
              email: action.email,
              given_name: action.firstName,
              family_name: action.lastName,
            },
          })
        ).pipe(
          map((signUpResult) => {
            console.log(signUpResult, 'signUpResult');

            return signUpSuccess();
          }),
          catchError((errorRes) => {
            console.log(errorRes, 'errorRes');

            return of(
              authenticationFailed({
                errorMessage: getErrorMessage(errorRes),
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

  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkSession),
      exhaustMap(() => {
        return from(Auth.currentSession()).pipe(
          map((user) => {
            if (user) {
              const idToken = user.getIdToken();
              const expirationDuration =
                new Date(idToken.payload['exp']).getTime() -
                new Date().getTime();
              const currentUser = new UserModel(
                idToken.payload['email'],
                idToken.payload['id'],
                idToken.getJwtToken(),
                new Date(expirationDuration)
              );
              return authenticate({ user: currentUser });
            } else {
              return authenticationFailed({ errorMessage: '' });
            }
          }),
          catchError((error) => {
            console.log(error, 'error');

            return of(
              authenticationFailed({ errorMessage: getErrorMessage(error) })
            );
          })
        );
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
          this.router.navigate(['/auth'], {
            queryParamsHandling: 'merge',
            preserveFragment: true,
          });
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

function getErrorMessage(error: { message: string }): string {
  let errorMessage = 'An Error occured';

  const responseErrorMessage = error?.message;
  switch (responseErrorMessage) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists Already';
      break;
    default:
      errorMessage = responseErrorMessage;
  }

  return errorMessage;
}
