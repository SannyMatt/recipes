import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { createAction, props } from '@ngrx/store';
import { UserModel } from '../user.model.';
import { SignUpUserData } from './auth.effects';

export const AUTHENTICATE = '[Auth] Authenticate';
export const SIGN_IN_START = '[Auth] Sign in start';
export const SIGN_UP_START = '[Auth] Sign up start';
export const AUTHENTICATION_FAILED = '[Auth] Authentication failed';



export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear error';
export const CLEAR_STORE = '[Auth] Clear store';
export const CLEAR_AUTH_SIGN_UP_STORE = '[Auth] Clear auth sign up store';

export const SIGN_UP_SUCCESS = '[Auth] Sign up success';
export const SIGN_OUT = '[Auth] Sign out';
export const SIGN_OUT_SUCCESS = '[Auth] Sign out success';
export const SIGN_OUT_FAIL = '[Auth] Sign out fail';
export const SIGN_IN_WITH_SOCIAL_START = '[Auth] Sign in with SIP start';
export const CHECK_SESSION = '[Auth] Check Session';
export const CLOSE_CONFIRMATION_MODE = '[Auth] Close confirmation mode';
export const SIGN_IN_FROM_CONFIRMATION_MODE =
  '[Auth] Sign in from confirmation mode';
export const CONFIRMATION_WITH_SIGNIN_START =
  '[Auth]Confirmation with Sign in start';
export const USER_IS_NOT_CONFIRMED_ERROR = '[Auth] User is not confirmed';
export const USER_IS_CONFIRMED = '[Auth] User is confirmed';
export const SET_INMEMORY_CREDENTIALS_STATUS =
  '[Auth] Set in memory credentials status ';

export const SWITCH_TO_CONFIRM_MODE = '[Auth] Switch To Confirm Mode';
export const SWITCH_TO_LOGIN_MODE = '[Auth] Switch To Login mode';
export const authenticate = createAction(
  AUTHENTICATE,
  props<{ user: UserModel; redirect?: boolean }>()
);

export const signInStart = createAction(
  SIGN_IN_START,
  props<{ email: string; password: string; userNotConfirmed: boolean }>()
);
export const signUpStart = createAction(SIGN_UP_START, props<SignUpUserData>());

export const authenticationFailed = createAction(
  AUTHENTICATION_FAILED,
  props<{ errorMessage?: string; userNotConfirmed?: boolean }>()
);










export const signUpSuccess = createAction(
  SIGN_UP_SUCCESS,
  props<{ email: string; password: string }>()
);






export const logout = createAction(LOGOUT);

export const clearError = createAction(CLEAR_ERROR);
export const clearAuthStore = createAction(CLEAR_STORE);
export const clearAuthSignUpStore = createAction(CLEAR_AUTH_SIGN_UP_STORE);

export const signInWithSIP = createAction(
  SIGN_IN_WITH_SOCIAL_START,
  props<{ provider: CognitoHostedUIIdentityProvider }>()
);
export const signOut = createAction(SIGN_OUT);
export const signOutSuccess = createAction(
  SIGN_OUT_SUCCESS,
  props<{ redirect?: boolean }>()
);
export const signOutFail = createAction(
  SIGN_OUT_FAIL,
  props<{ errorMessage: string }>()
);
export const checkSession = createAction(CHECK_SESSION);
export const closeConfirmationMode = createAction(CLOSE_CONFIRMATION_MODE);
export const signInFromConfirmationMode = createAction(
  SIGN_IN_FROM_CONFIRMATION_MODE,
  props<{ email: string; password: string }>()
);
export const setInMemoryCredentialsStatus = createAction(
  SET_INMEMORY_CREDENTIALS_STATUS,
  props<{ inMemoryCredentials: boolean }>()
);
export const confirmationWithSignInStart = createAction(
  CONFIRMATION_WITH_SIGNIN_START,
  props<{ email: string; password: string; confirmationCode: string }>()
);

export const switchToConfirmMode = createAction(SWITCH_TO_CONFIRM_MODE);
export const switchToLoginMode = createAction(SWITCH_TO_LOGIN_MODE);
