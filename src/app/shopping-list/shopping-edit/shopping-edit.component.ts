import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import * as fromApp from '../../store/app.reducer';
import {
  addIngredient,
  removeIngredient,
  updateIngredient
} from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  constructor(public store: Store<fromApp.AppState>) {}
  editSub: Subscription | undefined;
  storeSub: Subscription | undefined;
  @ViewChild('f') form!: NgForm;
  igToEdit: Ingredient | undefined;
  ngOnInit(): void {
    this.storeSub = this.store
      .select('shoppingList')
      .subscribe((shoppingListState) => {
        if (shoppingListState.editedIngredient) {
          this.igToEdit = shoppingListState.editedIngredient;
          this.form.setValue({
            name: this.igToEdit.name,
            amount: this.igToEdit.amount,
          });
        }
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    if (!this.igToEdit) {
      const id = uuidv4();
      this.store.dispatch(
        addIngredient(new Ingredient(id, value.name, value.amount))
      );
    } else {
      const id = this.igToEdit?.id;
      this.store.dispatch(
        updateIngredient(new Ingredient(id, value.name, value.amount))
      );
    }
    this.resetForm();
  }
  ngOnDestroy(): void {
    this.editSub?.unsubscribe();
    this.storeSub?.unsubscribe();
  }
  onDelete() {
    if (!!this.igToEdit) {
      this.store.dispatch(removeIngredient({ ingredientId: this.igToEdit.id }));
      this.resetForm();
    }
  }
  resetForm() {
    this.form.reset();
    this.igToEdit = undefined;
  }
}
