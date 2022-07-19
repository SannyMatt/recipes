import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class UnathGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private store: Store<AppState>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return Auth.currentAuthenticatedUser()
      .then(() => {
        this.router.navigate(['auth/profile']);
        return false;
      })
      .catch(() => {
        return true;
      });
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
