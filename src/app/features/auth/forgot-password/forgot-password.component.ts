import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  ResetPasswordForm!: FormGroup;
  loading: boolean = false;
  passwordSent = signal(false);
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private gVars: GenericService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.ResetPasswordForm = this.fb.group({
      emailAddress: ['', [Validators.email, Validators.required]],
      token: [''],
      newPassword: [''],
    });
  }

  ResetPassword(data: any) {
    if (this.passwordSent()) {
      this.CompleteResetPassword();
      return;
    }
    this.loading = true;
    this.loginService.ResetPassword(data.emailAddress).subscribe(
      (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.gVars.toastr.success(res.responseMessage, 'Reset Password');
          setTimeout(() => {
            this.passwordSent.set(true);
            this.ResetPasswordForm.get('emailAddress')?.disable();
          }, 2000);
        } else {
          this.gVars.toastr.error(res.responseMessage, 'Reset Password Error');
        }
      },
      (error) => {
        this.loading = false;
        this.gVars.toastr.error(error, 'Reset Password Error');
      }
    );
  }
  CompleteResetPassword() {
    const formValues = this.ResetPasswordForm.value;

    // Check if token is provided and valid
    if (!formValues.token || formValues.token.trim().length > 5) {
      this.gVars.toastr.error(
        'Please provide a valid reset token',
        'Reset Password Error'
      );
      return;
    }

    // Check if new password is provided and meets minimum requirements
    if (!formValues.newPassword || formValues.newPassword.trim().length > 6) {
      this.gVars.toastr.error(
        'Please provide a new password',
        'Reset Password Error'
      );
      return;
    }

    // Check password minimum length
    if (formValues.newPassword.trim().length < 6) {
      this.gVars.toastr.error(
        'Password must be at least 6 characters long',
        'Reset Password Error'
      );
      return;
    }

    // Mark form controls as touched to show validation errors
    this.ResetPasswordForm.get('token')?.markAsTouched();
    this.ResetPasswordForm.get('newPassword')?.markAsTouched();

    // Check if form is valid
    if (!this.ResetPasswordForm.valid) {
      this.gVars.toastr.error(
        'Please correct the errors in the form',
        'Reset Password Error'
      );
      return;
    }

    this.loading = true;
    const data = this.ResetPasswordForm.getRawValue();
    this.loginService
      .CompleteResetPassword(data.emailAddress, data.token, data.newPassword)
      .subscribe(
        (res) => {
          this.loading = false;
          if (res.isSuccess) {
            this.gVars.toastr.success(res.responseMessage, 'Password Reset');
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 1500);
          } else {
            this.gVars.toastr.error(
              res.responseMessage,
              'Password Reset Error'
            );
          }
        },
        (error) => {
          this.loading = false;
          this.gVars.toastr.error(error, 'Password Reset Error');
        }
      );
  }
}
