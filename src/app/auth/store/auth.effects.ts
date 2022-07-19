import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { catchError, exhaustMap, from, map, of, tap } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { AuthService } from '../auth.service';
import { UserModel } from '../user.model.';
import {
  authenticate,
  authenticationFailed,
  checkSession,
  confirmationWithSignInStart,
  logout,
  signInStart,
  signInWithSIP,
  signOut,
  signOutFail,
  signOutSuccess,
  signUpStart,
  signUpSuccess,
} from './auth.actions';
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
            const token = user.getSignInUserSession()?.getIdToken();
            const signedUser = token?.payload;

            const authedUser = new UserModel(
              signedUser?.['email'] || '',
              signedUser?.['sub'] || '',
              token?.getJwtToken() || '',
              new Date(
                signedUser?.['email']?.['exp'] || new Date().getTime() * 1000
              )
            );

            return authenticate({ user: authedUser, redirect: true });
          }),
          catchError((errorRes) => {
            console.log(errorRes, 'Error res <<<<<<<');

            const message = getErrorMessage(errorRes);
            const errorState = {
              errorMessage: message,
              userNotConfirmed: false,
            };

            switch (message) {
              case 'User is not confirmed.':
                errorState.userNotConfirmed = true;
                break;
            }

            return of(authenticationFailed(errorState));
          })
        );
      })
    )
  );
  confirmationWithLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmationWithSignInStart),
      exhaustMap(({ password, email, confirmationCode }) => {
        return from(Auth.confirmSignUp(email, confirmationCode)).pipe(
          exhaustMap((data) => {
            if (data === 'SUCCESS') {
              return of(
                signInStart({ email, password, userNotConfirmed: false })
              );
            } else {
              return of(authenticationFailed({ errorMessage: data }));
            }
          }),
          catchError((errorRes) => {
            const errorState = {
              errorMessage: '',
              userNotConfirmed: false,
            };

            const message = getErrorMessage(errorRes);

            switch (message) {
              case 'User is not confirmed.':
                errorState.userNotConfirmed = true;
                break;

              default:
                errorState.errorMessage = message;
                break;
            }
            console.log(message, 'message');

            return of(authenticationFailed(errorState));
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
            return signOutSuccess({ redirect: true });
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
          map(() => {
            return signUpSuccess({
              email: action.email,
              password: action.password,
            });
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
  redirectHome$ = createEffect(
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
  redirectLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signOutSuccess),
        tap((signOutSuccess) => {
          if (signOutSuccess.redirect) {
            this.router.navigate(['/auth/sign-in']);
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
    private store: Store<AppState>,
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
