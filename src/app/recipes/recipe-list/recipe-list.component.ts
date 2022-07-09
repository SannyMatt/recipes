import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  onRecipeListUpdateSub?: Subscription;
  constructor(private recipeService: RecipeService) {}
  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    this.onRecipeListUpdateSub =
      this.recipeService.onRecipeListUpdate.subscribe(
        (recipes: Recipe[]) => (this.recipes = recipes)
      );
  }

  ngOnDestroy(): void {
    this.onRecipeListUpdateSub?.unsubscribe();
  }
}
