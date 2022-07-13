import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { deleteRecipe } from '../store/recipes.actions';
import { selectRecipeById } from '../store/recipes.selectors';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => {
          return params['id'];
        }),
        switchMap((recipeId) => {
          return this.store.select(selectRecipeById(recipeId));
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }
  addToSl() {
    if (this.recipe?.ingredients) {
      this.store.dispatch(
        addIngredients({ ingredients: this.recipe?.ingredients })
      );
    }
  }

  deleteRecipe(id: string) {
    this.store.dispatch(deleteRecipe({ id }));
    this.router.navigate(['../'], { relativeTo: this.route, replaceUrl: true });
  }
}
