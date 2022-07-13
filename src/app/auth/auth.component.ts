import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { State, Store } from '@ngrx/store';
import { lastValueFrom, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';
import { signInStart, signUpStart, clearError } from './store/auth.actions';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceHolderDirective, { static: false })
  alertHost?: PlaceHolderDirective;

  userStatusSub?: Subscription;
  isAuthenticated: boolean = false;
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  constructor(
    private containerRef: ViewContainerRef,
    public store: Store<fromApp.AppState>
  ) {}
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
    this.userStatusSub?.unsubscribe();
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
      this.store.dispatch(signUpStart({ email, password }));
    }
  }

  showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost;
    hostViewContainerRef?.viewContainerRef.clear();
    const createdComponentRef =
      hostViewContainerRef?.viewContainerRef.createComponent(AlertComponent);
  }
}
