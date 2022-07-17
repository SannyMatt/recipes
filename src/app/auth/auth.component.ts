import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Hub } from 'aws-amplify';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

import * as fromApp from '../store/app.reducer';
import {
  clearError,
  clearAuthStore,
  signInStart,
  signUpStart,
} from './store/auth.actions';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceHolderDirective, { static: false })
  alertHost?: PlaceHolderDirective;

  isAuthenticated: boolean = false;
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  constructor(public store: Store<fromApp.AppState>, public router: Router) {}
  authSub?: Subscription;
  ngOnInit(): void {


    this.authSub = this.store.select('auth').subscribe((authState) => {
      if (authState.errorMessage) {
        this.error = authState.errorMessage;
      }
      this.isLoading = authState.loading;
    });
  }
  ngOnDestroy(): void {
    this.store.dispatch(clearAuthStore());
    this.authSub?.unsubscribe();
  }

  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.store.dispatch(clearError());
    const { email, password } = form.value;

    if (this.isLoginMode) {
      this.store.dispatch(signInStart({ email, password }));
    } else {
      // this.store.dispatch(signUpStart({ email, password }));
    }
  }

  showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost;
    hostViewContainerRef?.viewContainerRef.clear();
    const createdComponentRef =
      hostViewContainerRef?.viewContainerRef.createComponent(AlertComponent);
  }
}
