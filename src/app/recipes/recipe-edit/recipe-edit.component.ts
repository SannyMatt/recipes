import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeForm!: FormGroup;
  id: string | undefined;
  currentRecipe: Recipe | undefined;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public recipeService: RecipeService,
    public fb: FormBuilder
  ) {}

  get isEdit() {
    return this.id;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id) {
        this.currentRecipe = this.recipeService.getRecipeById(this.id);
      }
      this.initForm();
    });
  }
  private initForm() {
    const currentRecipe = this.currentRecipe;
    let name = '';
    let imagePath = '';
    let description = '';
    const ingredients: any = [];
    const editMode = this.isEdit;
    if (editMode) {
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
    if (this.isEdit) {
      const isUpdateFailed = this.recipeService.updateRecipe(
        this.id!,
        this.recipeForm.value
      );

      if (isUpdateFailed) {
        alert(isUpdateFailed);
      }
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.onNavigateBack();
  }

  ngOnDestroy(): void {}
}
