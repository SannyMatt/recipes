import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { AppState } from '../store/app.reducer';
import { setToEditIngredient } from './store/shopping-list.actions';
import { shoppingListIngredients } from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: [],
})
export class ShoppingListComponent implements OnInit {
  ingredients?: Observable<Ingredient[]>;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.ingredients = this.store.pipe(select(shoppingListIngredients));
  }
  onEditIg(ig: Ingredient) {
    this.store.dispatch(setToEditIngredient(ig));
  }
}
