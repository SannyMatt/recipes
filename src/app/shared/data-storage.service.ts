import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  saveRecipe() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipe-book-7b12b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipes
      )
      .subscribe((resp) => {
        console.log(resp, 'REs');
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recipe-book-7b12b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map(({ ingredients = [], ...recipe }) => ({
            ...recipe,
            ingredients,
          }));
        })
      )
      .pipe(
        tap((recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
