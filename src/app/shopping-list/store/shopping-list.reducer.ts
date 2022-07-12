import { createReducer, on } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';
export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  editedIngredientId: string;
}
const initialState: State = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientId: '',
};

export const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, newIngredient) => ({
    ...state,
    ingredients: [...state.ingredients, newIngredient],
  })),
  on(ShoppingListActions.addIngredients, (state, { ingredients }) => ({
    ...state,
    ingredients: [...state.ingredients, ...ingredients],
  })),
  on(ShoppingListActions.updateIngredient, (state, updatedIngredient) => {
    const updatedIngredients = state.ingredients.map((prevIng) => {
      if (prevIng.id === updatedIngredient.id) {
        return { ...prevIng, ...updatedIngredient };
      }
      return prevIng;
    });
    return {
      ...state,
      editedIngredient: null,
      editedIngredientId: '',
      ingredients: updatedIngredients,
    };
  }),
  on(ShoppingListActions.setToEditIngredient, (state, newIngredient) => {
    return {
      ...state,
      editedIngredient: newIngredient,
      editedIngredientId: newIngredient.id,
    };
  }),
  on(ShoppingListActions.removeIngredient, (state, { ingredientId }) => {
    return {
      ...state,
      ingredients: state.ingredients.filter(
        (prevIg) => prevIg.id !== ingredientId
      ),
    };
  })
);
