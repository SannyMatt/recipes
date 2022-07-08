import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: [],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private ingChangeSub: Subscription | undefined;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingChangeSub = this.shoppingListService.onListChange.subscribe(
      (ing: Ingredient[]) => (this.ingredients = ing)
    );
    this.ingredients = this.shoppingListService.getIngredients();
  }
  ngOnDestroy(): void {
    this.ingChangeSub?.unsubscribe();
  }
}
