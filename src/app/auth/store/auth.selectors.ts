import { createSelector } from '@ngrx/store';
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
export const selectUserNotConfirmed = createSelector(
  (state: AppState) => state.auth,
  (authStore) => {
    return authStore.userNotConfirmed;
  }
);
export const selectInMemoryEmail = createSelector(
  (state: AppState) => state.auth,
  (authStore) => {
    return authStore.confirm.email;
  }
);
export const selectInMemoryCredentials = createSelector(
  (state: AppState) => state.auth,
  (authStore) => {
    return authStore.inMemoryCredentials;
  }
);
export const selectIsLoading = createSelector(
  (state: AppState) => state.auth,
  (authStore) => {
    return authStore.loading;
  }
);
