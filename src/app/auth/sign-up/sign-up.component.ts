import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import {
  clearAuthSignUpStore,
  clearError,
  closeConfirmationMode,
  signInFromConfirmationMode,
  signUpStart,
} from '../store/auth.actions';
import { SignUpUserData } from '../store/auth.effects';
import {
  selectAuthStoreConfirmationState,
  selectAuthStoreError,
} from '../store/auth.selectors';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  //INIT
  ngOnInit(): void {}
  //DESTROY
  authStoreSub?: Subscription;
  ngOnDestroy(): void {
    this.store.dispatch(clearAuthSignUpStore());
    this.authStoreSub?.unsubscribe();
  }

  //STORE
  error: Observable<string> = this.store.select(selectAuthStoreError);
  confirmationMode: Observable<boolean> = this.store.select(
    selectAuthStoreConfirmationState
  );

  //FORM
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    fname: new FormControl('', [Validators.min(2)]),
    lname: new FormControl('', [Validators.min(2)]),
  });
  //[Form] inputs
  get emailInput() {
    return this.signupForm.get('email');
  }
  get passwordInput() {
    return this.signupForm.get('password');
  }
  get fnameInput() {
    return this.signupForm.get('fname');
  }
  get lnameInput() {
    return this.signupForm.get('lname');
  }
  //[Form] Errors
  getEmailInputError() {
    if (this.emailInput?.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (this.emailInput?.hasError('required')) {
      return 'An Email is required.';
    }
    return '';
  }
  getPasswordInputError() {
    if (this.passwordInput?.hasError('required')) {
      return 'A password is required.';
    }
    return '';
  }
  //[Form] Submit
  shouldEnableSubmit() {
    return (
      !this.emailInput?.valid ||
      !this.passwordInput?.valid ||
      !this.fnameInput?.valid ||
      !this.lnameInput?.valid
    );
  }
  signUp() {
    this.store.dispatch(clearError());
    const signUpFormValues: SignUpUserData = {
      email: this.emailInput?.value,
      password: this.passwordInput?.value,
      firstName: this.fnameInput?.value,
      lastName: this.lnameInput?.value,
    };
    this.store.dispatch(signUpStart(signUpFormValues));
  }

  //CONFIRMATION Mode

  closeConfirmationMode() {
    this.signupForm.reset();
    this.store.dispatch(closeConfirmationMode());
  }
  signInWithConfirmation() {
    this.store.dispatch(
      signInFromConfirmationMode({
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      })
    );

    this.router.navigate(['../sign-in'], { relativeTo: this.route });
  }
}
