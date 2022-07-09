import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

import { ShoppingListService } from '../shopping-list.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  constructor(private shoppingListService: ShoppingListService) {}
  editSub: Subscription | undefined;
  @ViewChild('f') form!: NgForm;
  igToEdit: Ingredient | undefined;
  ngOnInit(): void {
    this.editSub = this.shoppingListService.onEdit.subscribe((id) => {
      const editIngredient = this.shoppingListService.getIngredientById(id);
      if (editIngredient) {
        this.igToEdit = editIngredient;
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
      this.shoppingListService.addItem(
        new Ingredient(id, value.name, value.amount)
      );
    } else {
      const id = this.igToEdit?.id;
      this.shoppingListService.editItem(
        new Ingredient(id, value.name, value.amount)
      );
    }
    this.resetForm();
  }
  ngOnDestroy(): void {
    this.editSub?.unsubscribe();
  }
  onDelete() {
    if (!!this.igToEdit) {
      this.shoppingListService.deliteItem(this.igToEdit.id);
      this.resetForm();
    }
  }
  resetForm() {
    this.form.reset();
    this.igToEdit = undefined;
  }
}
