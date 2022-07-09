import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { v4 as uuidv4 } from 'uuid';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  onRecipeListUpdate = new Subject<Recipe[]>();

  recipes: Recipe[] = [];

  constructor(public sl: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.onRecipeListUpdate.next(this.recipes);
  }
  getRecipes() {
    return this.recipes.slice();
  }
  getRecipeById(id: string) {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  async addRecipe({ name, ingredients, imagePath, description }: Recipe) {
    const id = uuidv4();

    const updatedIngredients =
      this.sl.getMergedIngredientsForRecipe(ingredients);

    const newRecipe = new Recipe(
      id,
      name,
      description,
      imagePath,
      updatedIngredients
    );

    this.recipes.push(newRecipe);
    this.onRecipeListUpdate.next(this.recipes);
  }

  updateRecipe(
    id: string,
    { name, ingredients, imagePath, description }: Recipe
  ) {
    const recipeToUpdate = this.recipes.find((recipe) => recipe.id === id);

    if (!recipeToUpdate) {
      return "Couldn't find recipe with such Id";
    }
    recipeToUpdate.name = name;
    recipeToUpdate.imagePath = imagePath;
    recipeToUpdate.description = description;
    recipeToUpdate.ingredients =
      this.sl.getMergedIngredientsForRecipe(ingredients);
    this.onRecipeListUpdate.next(this.recipes);

    return false;
  }

  deleteRecipe(id: string) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
    this.onRecipeListUpdate.next(this.recipes);
  }
}
