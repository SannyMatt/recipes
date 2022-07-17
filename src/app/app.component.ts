import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Auth, Hub } from 'aws-amplify';
import { AuthService } from './auth/auth.service';
import { autologin, checkSession } from './auth/store/auth.actions';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isCheckingSession: boolean = true;
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(checkSession());
    this.store.select('auth').subscribe((auth) => {
      if (!auth.loading) {
        this.isCheckingSession = auth.loading;
      }
    });
  }
  ngOnInit(): void {
    console.log(
      this.route.fragment.subscribe((...fragment) => {
        console.log(fragment, 'fragment!!!');
      }),
      'ROUTE FROM APP'
    );

    this.store.dispatch(checkSession());
  }
}
