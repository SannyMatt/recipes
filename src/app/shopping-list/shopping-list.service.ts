import { EventEmitter, Injectable, Output } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('cucumber', 6),
  ];
  @Output() onListChange = new EventEmitter();
  constructor() {}
  getIngredients() {
    return this.ingredients.slice();
  }
  addItem(ingredients: Ingredient) {
    this.ingredients.push(ingredients);
    this.onListChange.emit();
  }
  addFewItems(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.onListChange.emit();
  }
}
