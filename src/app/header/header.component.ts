import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userStatusSub?: Subscription;
  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userStatusSub = this.authService.userStatus.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  ngOnDestroy(): void {
    this.userStatusSub?.unsubscribe();
  }

  saveData() {
    this.dataStorage.saveRecipe();
  }
  fetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }
  logout() {
    this.authService.logout();
  }
}
