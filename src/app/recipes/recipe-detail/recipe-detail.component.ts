import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;

  constructor(
    private store: Store<AppState>,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      const recipe = this.recipeService.getRecipeById(id);
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
    this.recipeService.deleteRecipe(id);
    this.router.navigate(['../'], { relativeTo: this.route, replaceUrl: true });
  }
}
