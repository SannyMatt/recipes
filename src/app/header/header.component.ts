import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Hub } from 'aws-amplify';
import { map, Observable, Subscription, tap } from 'rxjs';

import { logout, signOut } from '../auth/store/auth.actions';
import { fetchRecipes, storeRecipes } from '../recipes/store/recipes.actions';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated?: Observable<boolean>;
  @Input('isCheckingSession') isCheckingSession: boolean = true;
  storeSub?: Subscription;
  constructor(private store: Store<AppState>) {
    this.isAuthenticated = this.store.select('auth').pipe(
      map((auth) => {
        return !!auth.user;
      })
    );
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
  }

  saveData() {
    this.store.dispatch(storeRecipes());
  }
  fetchData() {
    this.store.dispatch(fetchRecipes());
  }
  logout() {
    this.store.dispatch(signOut());
  }
}
