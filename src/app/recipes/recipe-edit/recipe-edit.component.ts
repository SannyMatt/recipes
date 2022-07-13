import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../recipe.model';
import { addRecipe, updateRecipe } from '../store/recipes.actions';
import { selectRecipeById } from '../store/recipes.selectors';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeForm!: FormGroup;
  currentRecipe: Recipe | undefined;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public store: Store<AppState>
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
        this.currentRecipe = recipe;

        this.initForm();
      });
  }
  private initForm() {
    const currentRecipe = this.currentRecipe;
    let id = uuidv4();
    let name = '';
    let imagePath = '';
    let description = '';
    const ingredients: any = [];
    if (currentRecipe) {
      id = currentRecipe.id;
      name = currentRecipe?.name || '';
      imagePath = currentRecipe?.imagePath || '';
      description = currentRecipe?.description || '';
      currentRecipe?.ingredients.forEach((i) =>
        ingredients.push(
          this.fb.group({
            name: [i.name, [Validators.required]],
            amount: [
              i.amount,
              [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)],
            ],
            id: [i.id],
          })
        )
      );
    }
    this.recipeForm = this.fb.group({
      id: [id, Validators.required],
      name: [name, Validators.required],
      imagePath: [imagePath, Validators.required],
      description: [description, Validators.required],
      ingredients: this.fb.array(ingredients),
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }
  addIngredient() {
    this.ingredients.push(
      this.fb.group({
        name: this.fb.control('', Validators.required),
        amount: this.fb.control('', [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
        id: this.fb.control(''),
      })
    );
  }
  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onNavigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    const { name, ingredients, imagePath, description, id }: Recipe =
      this.recipeForm.value;
    const recipe = new Recipe(id, name, description, imagePath, ingredients);

    if (this.currentRecipe) {
      this.store.dispatch(
        updateRecipe({ id: this.currentRecipe.id, recipe: recipe })
      );
    } else {
      this.store.dispatch(addRecipe(recipe));
    }

    this.onNavigateBack();
  }

  ngOnDestroy(): void {}
}
