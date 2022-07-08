import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  projectForm!: FormGroup;

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      projectName: new FormControl(
        null,
        [Validators.required],
        [this.forbiddenNamesFetch.bind(this)]
      ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      status: new FormControl(null, Validators.required),
    });
  }
  onSubmit() {
    console.log(this.projectForm, 'projectForm');
  }

  forbiddenNames(control: FormControl): ValidationErrors | null {
    if (control.value === 'Test') {
      return { forbiddenName: true };
    }

    return null;
  }
  forbiddenNamesFetch(
    control: any
  ): Promise<any> | Observable<any> {
    const promise = new Promise<any>((res) => {
      setTimeout(() => {
        if (control.value === 'Test') {
          res({ forbiddenName: true });
        } else {
          res(null);
        }
      }, 1500);
    });
    return promise;
  }
}
