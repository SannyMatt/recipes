import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
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
    private recipeService: RecipeService,
    private sl: ShoppingListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      const recipe = this.recipeService.getRecipeById(+id);
      this.recipe = recipe;
    });
  }
  addToSl() {
    if (this.recipe?.ingredients) {
      this.sl.addFewItems(this.recipe?.ingredients);
    }
  }
}
