import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import {
  clearAuthStore,
  clearError,
  confirmationWithSignInStart,
  setInMemoryCredentialsStatus,
  signInStart,
  signInWithSIP,
  switchToConfirmMode,
  switchToLoginMode,
} from '../store/auth.actions';
import { selectIsLoading } from '../store/auth.selectors';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  error: string = '';
  isLoading: Observable<boolean> = this.store.select(selectIsLoading);
  confirmationControl: boolean = false;

  inMemoryCredentials: boolean = false;
  inMemoryEmail: string = '';
  inMemoryPassword: string = '';

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
    //Disable/Enable password in case if we have the currentInmemory Email
    this.signinForm.get('email')?.valueChanges.subscribe((value) => {
      if (this.inMemoryEmail !== value) {
        this.store.dispatch(
          setInMemoryCredentialsStatus({ inMemoryCredentials: false })
        );
      } else {
        setInMemoryCredentialsStatus({ inMemoryCredentials: true });
        this.passwordInput?.patchValue(this.inMemoryPassword);
      }
    });
    this.authStoreSub = this.store
      .select('auth')
      .subscribe(
        ({ errorMessage, confirm, userNotConfirmed, inMemoryCredentials }) => {
          this.confirmationControl = userNotConfirmed;
          this.inMemoryCredentials = inMemoryCredentials;
          this.inMemoryEmail = confirm.email;
          this.inMemoryPassword = confirm.password;

          if (userNotConfirmed) {
            this.signinForm.addControl(
              'confirmationCode',
              new FormControl('', [Validators.required])
            );
            if (confirm.email && confirm.password && inMemoryCredentials) {
              this.signinForm.patchValue(
                {
                  email: confirm.email,
                  password: confirm.password,
                },
                { emitEvent: true }
              );
            }
          } else {
            this.signinForm.removeControl('confirmationCode');
          }

          this.error = errorMessage;
        }
      );
  }
  ngOnDestroy(): void {
    this.store.dispatch(clearAuthStore());
    this.authStoreSub?.unsubscribe();
  }
  signIn() {
    const values = this.signinForm.value;
    this.store.dispatch(clearError());
    if (!this.confirmationControl) {
      this.store.dispatch(
        signInStart({
          email: values.email,
          password: values.password,
          userNotConfirmed: false,
        })
      );
    } else {
      this.store.dispatch(
        confirmationWithSignInStart({
          email: values.email,
          password: values.password,
          confirmationCode: values.confirmationCode || '',
        })
      );
    }
  }

  signInWithGoogle() {
    this.store.dispatch(
      signInWithSIP({ provider: CognitoHostedUIIdentityProvider.Google })
    );
  }

  switchToConfirmMode() {
    this.store.dispatch(switchToConfirmMode());
  }
  switchToLoginMode() {
    this.store.dispatch(switchToLoginMode());
  }
}
