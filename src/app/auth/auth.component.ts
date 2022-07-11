import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService } from './auth.service';

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
    private authService: AuthService,
    private router: Router,
    private containerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.userStatusSub = this.authService.userStatus.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.router.navigate(['/recipes']);
      }
    });
  }
  ngOnDestroy(): void {
    this.userStatusSub?.unsubscribe();
  }

  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.error = null;
    const { email, password } = form.value;

    if (this.isLoginMode) {
      this.isLoading = true;
      try {
        const res = await lastValueFrom(
          this.authService.login(email, password)
        );
      } catch (error) {
        if (typeof error === 'string') {
          this.error = error;
        }
        if (error instanceof Error) {
          this.error = error.message;
        }
      } finally {
        this.isLoading = false;
      }
    } else {
      this.isLoading = true;
      try {
        const res = await lastValueFrom(
          this.authService.signUp(email, password)
        );
      } catch (error) {
        if (typeof error === 'string') {
          this.error = error;
        }
        if (error instanceof Error) {
          this.error = error.message;
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost;
    hostViewContainerRef?.viewContainerRef.clear();
    const createdComponentRef =
      hostViewContainerRef?.viewContainerRef.createComponent(AlertComponent);
  }
}
