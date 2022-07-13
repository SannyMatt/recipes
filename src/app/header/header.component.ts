import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { logout } from '../auth/store/auth.actions';
import { fetchRecipes, storeRecipes } from '../recipes/store/recipes.actions';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  storeSub?: Subscription;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((user) => {
      this.isAuthenticated = !!user.user;
    });
  }
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
    this.store.dispatch(logout());
  }
}
