import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

import * as fromApp from '../store/app.reducer';
import { clearAuthStore, clearError } from './store/auth.actions';
import { selectIsLoading } from './store/auth.selectors';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  constructor(public store: Store<fromApp.AppState>, public router: Router) {}

  // State/Store
  isLoading: Observable<boolean> = this.store.select(selectIsLoading);

  // Destroy
  ngOnDestroy(): void {
    this.store.dispatch(clearAuthStore());
  }

  //Legacy code

  @ViewChild(PlaceHolderDirective, { static: false })
  alertHost?: PlaceHolderDirective;

  isAuthenticated: boolean = false;
  isLoginMode = true;

  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.store.dispatch(clearError());
    const { email, password } = form.value;
  }

  showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost;
    hostViewContainerRef?.viewContainerRef.clear();
    const createdComponentRef =
      hostViewContainerRef?.viewContainerRef.createComponent(AlertComponent);
  }
}
