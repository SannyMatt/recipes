import { createAction, props } from '@ngrx/store';
import { UserModel } from '../user.model.';

export const AUTHENTICATE = '[Auth] Authenticate';
export const SIGN_IN_START = '[Auth] Sign in start';
export const SIGN_UP_START = '[Auth] Sign up start';
export const AUTHENTICATION_FAILED = '[Auth] Authentication failed';
export const AUTOLOGIN = '[Auth] AutoLogin';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear error';
export const CLEAR_STORE = '[Auth] Clear store';

export const authenticate = createAction(
  AUTHENTICATE,
  props<{ user: UserModel; redirect?: boolean }>()
);

export const signInStart = createAction(
  SIGN_IN_START,
  props<{ email: string; password: string }>()
);
export const signUpStart = createAction(
  SIGN_UP_START,
  props<{ email: string; password: string }>()
);
export const authenticationFailed = createAction(
  AUTHENTICATION_FAILED,
  props<{ errorMessage: string }>()
);

export const autologin = createAction(AUTOLOGIN);
export const logout = createAction(LOGOUT);

export const clearError = createAction(CLEAR_ERROR);
export const clearStore = createAction(CLEAR_STORE);
