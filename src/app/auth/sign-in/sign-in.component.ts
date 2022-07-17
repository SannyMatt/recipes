import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CognitoHostedUIIdentityProvider, Auth } from '@aws-amplify/auth';
import { Store } from '@ngrx/store';
import { throws } from 'assert';
import { map, Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import {
  clearAuthStore,
  signInStart,
  signInWithSIP,
} from '../store/auth.actions';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  error: string = '';
  signinForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
  });

  get emailInput() {
    return this.signinForm.get('email');
  }
  get passwordInput() {
    return this.signinForm.get('password');
  }
  constructor(public store: Store<AppState>) {}

  authStoreSub?: Subscription;
  ngOnInit(): void {
    this.authStoreSub = this.store.select('auth').subscribe((authStore) => {
      console.log(authStore.errorMessage, 'authStore.errorMessage');

      this.error = authStore.errorMessage;
    });
  }
  ngOnDestroy(): void {
    this.store.dispatch(clearAuthStore());

    this.authStoreSub?.unsubscribe();
  }
  signIn() {
    const values = this.signinForm.value;
    this.store.dispatch(
      signInStart({ email: values.email, password: values.password })
    );
  }
  signInWithGoogle() {
    this.store.dispatch(
      signInWithSIP({ provider: CognitoHostedUIIdentityProvider.Google })
    );
  }
}
