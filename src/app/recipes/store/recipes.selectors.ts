import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

export const selectRecipes = createSelector(
  (state: AppState) => state.recipes,
  (recipes) => {
    return recipes.recipes;
  }
);
export const selectRecipeById = (id: string) => {
  return createSelector(
    (state: AppState) => {
      return state.recipes;
    },
    (recipes) => {
      return recipes.recipes.find((recipe) => recipe.id === id);
    }
  );
};
