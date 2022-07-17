import {  createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
export const selectAuthStoreError = createSelector(
  (state: AppState) => state.auth,
  (authStore) => {
    return authStore.errorMessage;
  }
);
export const selectAuthStoreConfirmationState = createSelector(
  (state: AppState) => state.auth,
  (authStore) => {
    return authStore.confirmationMode;
  }
);
