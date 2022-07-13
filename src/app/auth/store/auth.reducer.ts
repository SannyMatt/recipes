import { createReducer, on } from '@ngrx/store';
import { UserModel } from '../user.model.';
import {
  authenticate,
  authenticationFailed,
  autologin,
  clearError,
  clearStore,
  logout,
  signInStart,
  signUpStart,
} from './auth.actions';

export interface State {
  user: UserModel | null;
  errorMessage: string;
  loading: boolean;
  redirect: boolean;
}
const initialState: State = {
  user: null,
  errorMessage: '',
  loading: false,
  redirect: false,
};

export const authReducer = createReducer(
  initialState,
  on(authenticate, (state, { user, redirect }) => {
    return { ...state, user, loading: false, redirect: redirect || false };
  }),
  on(signInStart, (state) => {
    return { ...state, loading: true };
  }),
  on(signUpStart, (state) => {
    return { ...state, loading: true };
  }),
  on(authenticationFailed, (state, { errorMessage }) => {
    return { ...state, loading: false, errorMessage };
  }),
  on(clearError, (state) => ({ ...state, errorMessage: '' })),
  on(clearStore, () => initialState),
  on(autologin, (state) => state),
  on(logout, (state) => ({
    ...state,
    user: null,
  }))
);
