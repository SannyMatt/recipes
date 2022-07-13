import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, of, switchMap, take } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';
import { fetchRecipes, setRecipes } from './store/recipes.actions';
import { selectRecipes } from './store/recipes.selectors';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(selectRecipes).pipe(
      take(1),
      map((recipes) => {
        return recipes;
      }),
      switchMap((recipes) => {
        if (!recipes.length) {
          this.store.dispatch(fetchRecipes());
          return this.actions$.pipe(
            ofType(setRecipes),
            take(1),
            map((recipes) => {
              return recipes.recipes;
            })
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}
