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
      emailAddress: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      organizationCode: ['', Validators.required],
      ipAddress: ['1.0.1.1'],
    });
  }

  Login(data: LoginPayload) {
    this.loading = true;
    this.loginService.LoginUser(data).subscribe(
      (res) => {
        this.loading = false;
        ///check for redicect url in redirectUrl query param
        const redirectUrl =
          this.gVars.router.routerState.snapshot.root.queryParams[
            'redirectUrl'
          ];
        if (res.isSuccess) {
          this.gVars.toastr.success('Login Success');

          // Store the organization code from user input in local storage
          if (data.organizationCode) {
            localStorage.setItem('organizationCode', data.organizationCode);
            // console.log('Organization Code stored in localStorage:', data.organizationCode);
          }

          this.store.dispatch(
            AuthActions.loginSuccess({
              user: res,
            })
          );
          if (redirectUrl) {
            this.gVars.router.navigate([redirectUrl]);
          } else {
            this.fetchOrganizationId(res.data.user.userId);
            // this.gVars.router.navigate(['/auth/onboarding']);
          }
        } else {
          this.gVars.toastr.error(res.responseMessage);
        }
        console.log(res);
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  fetchOrganizationId(userId: string) {
    this.loginService
      .GetOrganizationDetails(userId)
      .pipe(first())
      .subscribe((orgId) => {
        console.log('Fetched Organization ID:', orgId);
        sessionStorage.setItem('organizationInfo', JSON.stringify(orgId));
        this.gVars.router.navigate(['/auth/onboarding']);
      });
  }
}
