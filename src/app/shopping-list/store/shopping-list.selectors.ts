import {  createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
export const shoppingListIngredients = createSelector(
  (state: AppState) => state.shoppingList,
  (shoppingList) => {
    return shoppingList.ingredients;
  }
);
