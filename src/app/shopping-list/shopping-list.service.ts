import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { v4 as uuidv4 } from 'uuid';

const ingredients = [
  new Ingredient(uuidv4(), 'apples', 5),
  new Ingredient(uuidv4(), 'cucumber', 6),
];
@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  onEdit = new Subject<string>();
  private ingredients: Ingredient[] = ingredients;
  onListChange = new Subject<Ingredient[]>();

  constructor() {}
  getIngredients() {
    return this.ingredients.slice();
  }
  getIngredientById(id: string) {
    return this.ingredients.find((ig) => ig.id === id);
  }
  getIngredientByName(
    name: string,
    ingredients: Ingredient[] = this.ingredients
  ) {
    return ingredients.find(
      (ig) => ig.name.toLowerCase() === name.toLowerCase()
    );
  }
  addItem(ingredient: Ingredient) {
    const existingIg = this.getIngredientByName(ingredient.name);
    if (existingIg) {
      existingIg.amount += +ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }

    this.onListChange.next(this.ingredients);
  }
  addFewItems(ingredients: Ingredient[]) {
    const filteredIngredients = ingredients.filter((ig) => {
      const existingIg = this.getIngredientByName(ig.name);
      if (existingIg) {
        existingIg.amount += +ig.amount;
        return false;
      }
      return true;
    });
    this.ingredients.push(...filteredIngredients);
    this.onListChange.next(this.ingredients);
  }

  editItem(ingredient: Ingredient) {
    this.ingredients = this.ingredients.map((ing) => {
      if (ing.id === ingredient.id) {
        return ingredient;
      }
      return ing;
    });
    this.onListChange.next(this.ingredients);
  }

  deliteItem(id: string) {
    this.ingredients = this.ingredients.filter((ing) => ing.id !== id);
    this.onListChange.next(this.ingredients);
  }

  getMergedIngredientsForRecipe(ingredients: Ingredient[]) {
    const currentRecipeIngredients: Ingredient[] = [];

    ingredients.forEach((ig) => {
      const haveInShoppingList = this.getIngredientByName(ig.name);
      if (haveInShoppingList) {
        ig.id = haveInShoppingList.id;
      } else {
        ig.id = uuidv4();
      }

      const alreadyAddedIg = this.getIngredientByName(
        ig.name,
        currentRecipeIngredients
      );
      if (!alreadyAddedIg) {
        currentRecipeIngredients.push(ig);
      } else {
        alreadyAddedIg.amount += ig.amount;
      }
    });

    return currentRecipeIngredients;
  }
}
