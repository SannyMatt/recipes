import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const ADD_RECIPE = '[Recipe] Add recipe';
export const UPDATE_RECIPE = '[Recipe] Update recipe';
export const FETCH_RECIPES = '[Recipe] Fetch recipes';
export const SET_RECIPES = '[Recipe] Set recipes';
export const STORE_RECIPES = '[Recipe] Store recipes to db';
export const FETCH_FAILED = '[Recipe] Fetch Failed';
export const DELETE_RECIPE = '[Recipe] Delete recipe';

export const addRecipe = createAction(ADD_RECIPE, props<Recipe>());
export const updateRecipe = createAction(
  UPDATE_RECIPE,
  props<{ id: string; recipe: Recipe }>()
);
export const fetchRecipes = createAction(FETCH_RECIPES);
export const setRecipes = createAction(
  SET_RECIPES,
  props<{ recipes: Recipe[] }>()
);
export const recipesFetchFailed = createAction(
  FETCH_FAILED,
  props<{ errorMessage: string }>()
);
export const deleteRecipe = createAction(
  DELETE_RECIPE,
  props<{ id: string }>()
);
export const storeRecipes = createAction(STORE_RECIPES);
