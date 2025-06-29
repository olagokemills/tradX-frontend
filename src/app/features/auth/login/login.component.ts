import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { LoginPayload } from 'src/app/shared/models/appData.model';
import * as AuthActions from '../../../shared/store/auth/auth.actions';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { selectSignupOrganizationId } from 'src/app/shared/store/auth/auth.selectors';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  loading: boolean = false;
  organizationId$!: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private gVars: GenericService,
    private store: Store,
    private actions$: Actions,
    private router: Router
  ) {
    this.actions$.subscribe((action) => {
      console.log('Dispatched Action:', action);
    });
  }
  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      emailAddress: [],
      password: ['', Validators.required],
      ipAddress: ['1.0.1.1'],
    });
    this.organizationId$ = this.store.select(selectSignupOrganizationId);
  }

  Login(data: LoginPayload) {
    this.loading = true;
    this.organizationId$.pipe(first()).subscribe((orgId) => {
      // Fallback to localStorage if orgId is not in state
      let organizationCode = orgId;
      if (!organizationCode) {
        organizationCode = localStorage.getItem('signup_organizationId') || '';
      }
      // Use only the value after @ if present
      if (organizationCode && organizationCode.includes('@')) {
        organizationCode = organizationCode.split('@')[1];
      }
      const loginData = { ...data, organizationCode };
      this.loginService.LoginUser(loginData).subscribe(
        (res) => {
          this.loading = false;
          ///check for redicect url in redirectUrl query param
          const redirectUrl =
            this.gVars.router.routerState.snapshot.root.queryParams[
            'redirectUrl'
            ];
          if (res.isSuccess) {
            // Clear organizationId from localStorage after successful login
            localStorage.removeItem('signup_organizationId');
            if (redirectUrl) {
              this.gVars.router.navigate([redirectUrl]);
            }
            this.gVars.toastr.success('Login Success');
            this.store.dispatch(
              AuthActions.loginSuccess({
                user: res,
              })
            );
            this.gVars.router.navigate(['/auth/onboarding']);
          } else {
            this.gVars.toastr.error(res.responseMessage);
          }
          console.log(res);
        },
        (err) => {
          this.loading = false;
        }
      );
    });
  }
}
