import { createReducer, on } from '@ngrx/store';
import { UserModel } from '../user.model.';
import {
  authenticate,
  authenticationFailed,
  autologin,
  checkSession,
  clearAuthStore,
  clearError,
  closeConfirmationMode,
  logout,
  signInStart,
  signInWithSIP,
  signOut,
  signOutFail,
  signOutSuccess,
  signUpStart,
  signUpSuccess,
} from './auth.actions';

export interface State {
  user: UserModel | null;
  errorMessage: string;
  loading: boolean;
  redirect: boolean;
  confirmationMode: boolean;
}
const initialState: State = {
  user: null,
  errorMessage: '',
  loading: false,
  redirect: false,
  confirmationMode: false,
};

export const authReducer = createReducer(
  initialState,
  on(authenticate, (state, { user, redirect }) => {
    return { ...state, user, loading: false, redirect: redirect || false };
  }),
  on(signInStart, (state) => {
    return { ...state, loading: true };
  }),
  on(signInWithSIP, (state) => {
    return { ...state, loading: true };
  }),
  on(signUpStart, (state) => {
    return { ...state, loading: true };
  }),
  on(authenticationFailed, (state, { errorMessage }) => {
    return { ...state, loading: false, errorMessage };
  }),
  on(clearError, (state) => ({ ...state, errorMessage: '' })),
  on(clearAuthStore, () => initialState),
  on(autologin, (state) => state),
  on(logout, (state) => ({
    ...state,
    loading: false,
    user: null,
  })),
  on(checkSession, (state) => {
    return { ...state, loading: true };
  }),
  on(signOut, (state) => ({
    ...state,
    loading: true,
  })),
  on(signOutSuccess, () => initialState),
  on(signUpSuccess, (state) => ({
    ...state,
    confirmationMode: true,
    loading: false,
  })),
  on(signOutFail, (state, { errorMessage }) => ({
    ...state,
    loading: false,
    errorMessage,
  })),
  on(closeConfirmationMode, (state) => ({ ...state, confirmationMode: false }))
);
