import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, take } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap((user) => {
        if (!user.user) {
          return next.handle(req);
        }
        const modifedRequest = req.clone({
          params: new HttpParams().set('auth', user?.user.token || ''),
        });

        return next.handle(modifedRequest);
      })
    );
  }
}
