import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.userStatus.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifedRequest = req.clone({
          params: new HttpParams().set('auth', user?.token || ''),
        });

        return next.handle(modifedRequest);
      })
    );
  }
}
