import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { logout } from '../auth/store/auth.actions';
import { DataStorageService } from '../shared/data-storage.service';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  storeSub?: Subscription;
  constructor(
    private dataStorage: DataStorageService,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((user) => {
      this.isAuthenticated = !!user.user;
    });
  }
  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
  }

  saveData() {
    this.dataStorage.saveRecipe();
  }
  fetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }
  logout() {
    this.store.dispatch(logout());
  }
}
