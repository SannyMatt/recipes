import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  exhaustMap,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import {
  fetchRecipes,
  recipesFetchFailed,
  setRecipes,
  storeRecipes,
} from './recipes.actions';
import { selectRecipes } from './recipes.selectors';
@Injectable()
export class RecipesEffect {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipes),
      exhaustMap(() => {
        return this.http
          .get<Recipe[]>(
            'https://recipe-book-7b12b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
          )
          .pipe(
            map((recipes) => {
              const formatedRecipes = recipes.map(
                ({ ingredients = [], ...recipe }) => ({
                  ...recipe,
                  ingredients,
                })
              );

              return setRecipes({ recipes: formatedRecipes });
            }),
            catchError((error) => {
              if (error instanceof Error) {
                return of(recipesFetchFailed({ errorMessage: error.message }));
              }
              return of(recipesFetchFailed({ errorMessage: 'Unknown error' }));
            })
          );
      })
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(storeRecipes),
        withLatestFrom(this.store.select(selectRecipes)),
        switchMap(([_, recipes]) => {
          return this.http.put(
            'https://recipe-book-7b12b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipes
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
