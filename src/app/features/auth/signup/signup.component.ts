import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { RegisterPayload } from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login/login.component.scss'],
})
export class SignupComponent implements OnInit {
  SignUpForm!: FormGroup;
  loading: boolean = false;
  constructor(private fb: FormBuilder, private loginService: LoginService) {}
  ngOnInit(): void {
    this.SignUpForm = this.fb.group({
      email: [, [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.minLength(6), Validators.required]],
      businessName: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.minLength(6)]],
    });
  }
  Register(data: RegisterPayload) {
    this.loading = true;
    this.loginService.Register(data).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
