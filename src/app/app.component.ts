import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Hub } from 'aws-amplify';
import { AuthService } from './auth/auth.service';
import { checkSession } from './auth/store/auth.actions';
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
    Hub.listen('auth', (data) => {
      console.log(data, 'data');

      switch (data.payload.message) {
        case 'signIn':
          console.log('signIn', data);
          break;
        case 'signOut':
          console.log('signOut', data);
          break;

        default:
          break;
      }
    });

    this.store.dispatch(checkSession());
  }
}
