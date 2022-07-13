import { createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import {
  addRecipe,
  deleteRecipe,
  recipesFetchFailed,
  setRecipes,
  updateRecipe,
} from './recipes.actions';

export interface State {
  recipes: Recipe[];
  errorMessage: string;
  isEditMode: boolean;
}
const initialState: State = {
  recipes: [],
  errorMessage: '',
  isEditMode: false,
};

export const recipesReducer = createReducer(
  initialState,
  on(addRecipe, (state, recipe) => ({
    ...state,
    recipes: [...state.recipes, recipe],
  })),
  on(updateRecipe, (state, { id, recipe }) => {
    const updatedRecipes = state.recipes.map((prevRecipe) => {
      if (prevRecipe.id === id) {
        return { ...prevRecipe, ...recipe };
      }
      return prevRecipe;
    });
    return {
      ...state,
      recipes: updatedRecipes,
    };
  }),
  on(setRecipes, (state, { recipes }) => {
    return { ...state, recipes };
  }),
  on(recipesFetchFailed, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(deleteRecipe, (state, { id }) => {
    return {
      ...state,
      recipes: state.recipes.filter((recipe) => recipe.id !== id),
    };
  })
);
