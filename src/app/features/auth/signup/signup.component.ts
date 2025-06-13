import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { passwordMatchValidator } from 'src/app/shared/classes/password-match';
import { passwordValidator } from 'src/app/shared/classes/password-validator';
import { RegisterPayload } from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login/login.component.scss'],
})
export class SignupComponent implements OnInit {
  SignUpForm!: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private utils: GenericService
  ) {}
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
  }
  Register(data: RegisterPayload) {
    this.loading = true;
    this.loginService.Register(data).subscribe(
      (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.utils.toastr.success(
            res.responseMessage,
            'Please proceed to login'
          );
          setTimeout(() => {
            this.utils.router.navigate(['/auth/login']);
          }, 2000);
        }

        console.log(res);
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
