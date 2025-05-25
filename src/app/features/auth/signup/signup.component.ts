import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login/login.component.scss'],
})
export class SignupComponent implements OnInit {
  SignUpForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.SignUpForm = this.fb.group({
      email: [, [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.minLength(6), Validators.required]],
      businessName: ['', [Validators.minLength(6), Validators.required]],
    });
  }
}
