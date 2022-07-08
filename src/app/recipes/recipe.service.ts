import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes: Recipe[] = [
    new Recipe(
      1,
      'Test Name 1',
      'Test descriptoin 1',
      'https://img.wallpapersafari.com/desktop/1024/576/5/2/GSrJ3L.jpg',
      [new Ingredient('Name 1', 2), new Ingredient('Name 2', 4)]
    ),
    new Recipe(
      2,
      'Test Name 2',
      'Test description 2',
      'https://img.wallpapersafari.com/desktop/1024/576/5/2/GSrJ3L.jpg',
      [new Ingredient('Name 1', 2), new Ingredient('Name 2', 4)]
    ),
  ];

  constructor() {}

  getRecipes() {
    return this.recipes.slice();
  }
  getRecipeById(id: number) {
    return this.recipes.find((recipe) => recipe.id === id);
  }
}
