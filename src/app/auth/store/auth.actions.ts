import { createAction, props } from '@ngrx/store';
import { UserModel } from '../user.model.';
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { SignUpUserData } from './auth.effects';
export const AUTHENTICATE = '[Auth] Authenticate';
export const SIGN_IN_START = '[Auth] Sign in start';
export const SIGN_UP_START = '[Auth] Sign up start';
export const AUTHENTICATION_FAILED = '[Auth] Authentication failed';
export const AUTOLOGIN = '[Auth] AutoLogin';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear error';
export const CLEAR_STORE = '[Auth] Clear store';

export const SIGN_UP_SUCCESS = '[Auth] Sign up success';
export const SIGN_OUT = '[Auth] Sign out';
export const SIGN_OUT_SUCCESS = '[Auth] Sign out success';
export const SIGN_OUT_FAIL = '[Auth] Sign out fail';
export const SIGN_IN_WITH_SOCIAL_START = '[Auth] Sign in with SIP start';
export const CHECK_SESSION = '[Auth] Check Session';
export const CLOSE_CONFIRMATION_MODE = "[Auth] Close confirmation mode"
export const authenticate = createAction(
  AUTHENTICATE,
  props<{ user: UserModel; redirect?: boolean }>()
);

export const signInStart = createAction(
  SIGN_IN_START,
  props<{ email: string; password: string }>()
);
export const signUpStart = createAction(SIGN_UP_START, props<SignUpUserData>());
export const signUpSuccess = createAction(SIGN_UP_SUCCESS);
export const authenticationFailed = createAction(
  AUTHENTICATION_FAILED,
  props<{ errorMessage: string }>()
);

export const autologin = createAction(AUTOLOGIN);
export const logout = createAction(LOGOUT);

export const clearError = createAction(CLEAR_ERROR);
export const clearAuthStore = createAction(CLEAR_STORE);

export const signInWithSIP = createAction(
  SIGN_IN_WITH_SOCIAL_START,
  props<{ provider: CognitoHostedUIIdentityProvider }>()
);
export const signOut = createAction(SIGN_OUT);
export const signOutSuccess = createAction(SIGN_OUT_SUCCESS);
export const signOutFail = createAction(
  SIGN_OUT_FAIL,
  props<{ errorMessage: string }>()
);
export const checkSession = createAction(CHECK_SESSION);
export const closeConfirmationMode = createAction(CLOSE_CONFIRMATION_MODE);
