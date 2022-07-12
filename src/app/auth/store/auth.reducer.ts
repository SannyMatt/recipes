import { createReducer, on } from '@ngrx/store';
import { UserModel } from '../user.model.';
import { AuthTypes } from './auth.actions';

export interface State {
  user: UserModel | null;
}
const initialState: State = {
  user: null,
};
export function auth(state: State, action: AuthTypes) {
  switch (action.type) {
    default:
      return state;
  }
}
export const authReducer = createReducer(initialState, on(auth));
