import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('cucumber', 6),
  ];
  onListChange = new Subject<Ingredient[]>();
  constructor() {}
  getIngredients() {
    return this.ingredients.slice();
  }
  addItem(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.onListChange.next(this.ingredients);
  }
  addFewItems(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.onListChange.next(this.ingredients);
  }
}
