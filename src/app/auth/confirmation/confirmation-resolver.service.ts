import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Auth } from 'aws-amplify';
import { catchError, from, map, Observable, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationResolverService implements Resolve<boolean> {
  userName: string | null = '';
  confirmationCode: string | null = '';
  clientId: string | null = '';
  constructor(private actions$: Actions) {}

  setConfirmationParams(url: string) {
    const decodedUrl = decodeURIComponent(url);
    const urlParams = new URLSearchParams(
      decodedUrl.split('?')[2].split('>', 1)[0]
    );
    this.userName = urlParams.get('user_name');
    this.confirmationCode = urlParams.get('confirmation_code');
    this.clientId = urlParams.get('client_id');
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.setConfirmationParams(state.url);

    return from(
      Auth.confirmSignUp(this.userName!, this.confirmationCode!)
    ).pipe(
      map((res) => {
        console.log(res, 'res');


        return true;
      }),
      catchError((error) => {
        console.log(error, 'error');

        return of(false);
      })
    );
    // if (this.userName && this.confirmationCode && this.clientId) {
    //   return { confirmed: true, message: 'Confirmed' };
    // }
    // return { confirmed: false, message: 'Confirmed' };
  }
}
