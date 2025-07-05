import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { passwordMatchValidator } from 'src/app/shared/classes/password-match';
import { passwordValidator } from 'src/app/shared/classes/password-validator';
import { RegisterPayload } from 'src/app/shared/models/appData.model';
import { Store } from '@ngrx/store';
import * as AuthActions from 'src/app/shared/store/auth/auth.actions';
import { selectSignup } from 'src/app/shared/store/auth/auth.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login/login.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  SignUpForm!: FormGroup;
  loading: boolean = false;
  signupSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private utils: GenericService,
    private store: Store
  ) { }
  ngOnInit(): void {
    this.SignUpForm = this.fb.group(
      {
        emailAddress: [, [Validators.email, Validators.required]],
        firstName: ['', [Validators.minLength(6), Validators.required]],
        lastName: ['', [Validators.minLength(6), Validators.required]],
        businessName: ['', [Validators.minLength(6), Validators.required]],
        password: ['', passwordValidator],
        confirmPassword: [''],
      },
      { validators: passwordMatchValidator() }
    );
    this.signupSub = this.store.select(selectSignup).subscribe((signup) => {
      if (signup.response && signup.response.isSuccess) {
        this.loading = false;

        // Store the organization ID in localStorage
        const organizationId = signup.response.data?.organizationId;
        if (organizationId) {
          localStorage.setItem('organizationId', organizationId);
          // console.log('Organization ID stored in localStorage after signup:', organizationId);
        }

        this.utils.toastr.success(
          signup.response.responseMessage,
          'Please proceed to login'
        );
        setTimeout(() => {
          this.utils.router.navigate(['/auth/login']);
        }, 2000);
      }
      if (signup.error) {
        this.loading = false;
        this.utils.toastr.error(signup.error, 'Signup Error');
      }
    });
  }
  Register(data: RegisterPayload) {
    this.loading = true;
    this.store.dispatch(AuthActions.signupRequest({ payload: data }));
  }
  ngOnDestroy(): void {
    if (this.signupSub) this.signupSub.unsubscribe();
  }
}
