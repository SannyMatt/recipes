import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import {
  clearAuthStore, closeConfirmationMode,
  signUpStart
} from '../store/auth.actions';
import { SignUpUserData } from '../store/auth.effects';
import {
  selectAuthStoreConfirmationState,
  selectAuthStoreError
} from '../store/auth.selectors';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  error: Observable<string> = this.store.select(selectAuthStoreError);
  confirmationMode: Observable<boolean> = this.store.select(
    selectAuthStoreConfirmationState
  );
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.min(10)]),
    fname: new FormControl('', [Validators.min(2)]),
    lname: new FormControl('', [Validators.min(2)]),
  });

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
  get phoneInput() {
    return this.signupForm.get('phone');
  }

  constructor(private store: Store<AppState>) {}

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
  shouldEnableSubmit() {
    return (
      !this.emailInput?.valid ||
      !this.passwordInput?.valid ||
      !this.fnameInput?.valid ||
      !this.lnameInput?.valid
    );
  }
  signUp() {
    const signUpFormValues: SignUpUserData = {
      email: this.emailInput?.value,
      password: this.passwordInput?.value,
      firstName: this.fnameInput?.value,
      lastName: this.lnameInput?.value,
    };
    this.store.dispatch(signUpStart(signUpFormValues));
  }
  getError(error: any) {
    console.log(error, 'error I need');
  }

  closeConfirmationMode() {
    this.store.dispatch(closeConfirmationMode());
  }

  authStoreSub?: Subscription;
  ngOnInit(): void {
    this.authStoreSub = this.store.select('auth').subscribe((authState) => {
      if (authState.confirmationMode) {
        this.signupForm.reset();
      }
    });
  }
  ngOnDestroy(): void {
    this.closeConfirmationMode();
    this.store.dispatch(clearAuthStore());
    this.authStoreSub?.unsubscribe();
  }
}
