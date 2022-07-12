import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = '[Shopping-list] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping-list] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping-list] Update Ingredient';
export const SET_TO_EDIT_INGREDIENT = '[Shopping-list] Set to edit Ingredient';
export const REMOVE_INGREDIENT = '[Shopping-list] Remove Ingredient';

export const addIngredient = createAction(ADD_INGREDIENT, props<Ingredient>());
export const addIngredients = createAction(ADD_INGREDIENTS, props<{ingredients:Ingredient[]}>());
export const updateIngredient = createAction(
  UPDATE_INGREDIENT,
  props<Ingredient>()
);
export const setToEditIngredient = createAction(
  SET_TO_EDIT_INGREDIENT,
  props<Ingredient>()
);
export const removeIngredient = createAction(
  REMOVE_INGREDIENT,
  props<{ ingredientId: string }>()
);
