import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Auth } from 'aws-amplify';
import { map, Observable, take } from 'rxjs';
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
      console.log(route,"route UNAUTH");
      return Auth.currentAuthenticatedUser()
      .then(() => {
        this.router.navigate(['auth/profile',{
          queryParamsHandling: 'merge',
          preserveFragment: true,
          queryParams: {},
        }]);
        return false;
      })
      .catch(() => {
        console.log("UNAUTH CATCH");

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
