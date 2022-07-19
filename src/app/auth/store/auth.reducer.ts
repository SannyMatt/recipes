import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { UserModel } from '../user.model.';
import {
  authenticate,
  authenticationFailed,
  checkSession,
  clearAuthSignUpStore,
  clearAuthStore,
  clearError,
  closeConfirmationMode,
  confirmationWithSignInStart,
  logout,
  setInMemoryCredentialsStatus,
  signInFromConfirmationMode,
  signInStart,
  signInWithSIP,
  signOut,
  signOutFail,
  signOutSuccess,
  signUpStart,
  signUpSuccess,
  switchToConfirmMode,
  switchToLoginMode,
} from './auth.actions';

export interface State {
  user: UserModel | null;
  errorMessage: string;
  userNotConfirmed: boolean;
  loading: boolean;
  redirect: boolean;
  confirmationMode: boolean;
  confirm: { email: string; password: string };
  inMemoryCredentials: boolean;
}
const initialState: State = {
  user: null,
  errorMessage: '',
  userNotConfirmed: false,
  loading: false,
  redirect: false,
  confirmationMode: false,
  confirm: {
    email: '',
    password: '',
  },
  inMemoryCredentials: false,
};

export const authReducer = createReducer(
  initialState,
  on(authenticate, (state, { user, redirect }) => {
    return { ...state, user, loading: false, redirect: redirect || false };
  }),
  on(signInStart, (state, { userNotConfirmed }) => {
    return { ...state, loading: true, userNotConfirmed };
  }),
  on(signInWithSIP, (state) => {
    return { ...state, loading: true };
  }),
  on(signInFromConfirmationMode, (state, { email, password }) => ({
    ...state,
    confirm: { email, password },
    userNotConfirmed: true,
    inMemoryCredentials: true,
  })),
  on(setInMemoryCredentialsStatus, (state, { inMemoryCredentials }) => ({
    ...state,
    inMemoryCredentials,
  })),
  on(signUpStart, (state) => {
    return { ...state, loading: true };
  }),
  on(authenticationFailed, (state, { errorMessage, userNotConfirmed }) => {
    return {
      ...state,
      loading: false,
      errorMessage: errorMessage || state.errorMessage,
      userNotConfirmed: userNotConfirmed || state.userNotConfirmed,
    };
  }),
  on(clearError, (state) => ({ ...state, errorMessage: '' })),
  on(clearAuthStore, (state) => ({ ...initialState, user: state.user })),
  on(clearAuthSignUpStore, (state) => ({
    ...initialState,
    userNotConfirmed: state.userNotConfirmed,
    confirm: state.confirm,
    inMemoryCredentials: state.inMemoryCredentials,
  })),

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
  on(signOutSuccess, () => {
    return initialState;
  }),
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
  on(closeConfirmationMode, (state) => ({ ...state, confirmationMode: false })),
  on(confirmationWithSignInStart, (state) => ({ ...state, loading: true })),
  on(switchToConfirmMode, (state) => ({ ...state, userNotConfirmed: true })),
  on(switchToLoginMode, (state) => ({ ...state, userNotConfirmed: false }))
);
