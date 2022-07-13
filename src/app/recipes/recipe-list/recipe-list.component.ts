import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { selectRecipes } from '../store/recipes.selectors';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes?: Observable<Recipe[]>;
  recipeStoreSub?: Subscription;
  constructor(private store: Store<AppState>) {}
  ngOnInit() {
    this.recipes = this.store.select(selectRecipes);
  }
}
