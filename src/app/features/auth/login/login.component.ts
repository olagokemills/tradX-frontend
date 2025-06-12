import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { LoginPayload } from 'src/app/shared/models/appData.model';

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
    private gVars: GenericService
  ) {}
  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      emailAddress: [],
      password: ['', Validators.required],
      ipAddress: ['1.0.1.1'],
    });
    this.gVars.toastr.error('ddd');
  }

  Login(data: LoginPayload) {
    this.loading = true;
    this.loginService.LoginUser(data).subscribe(
      (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.gVars.toastr.success('Login Success');
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
}
