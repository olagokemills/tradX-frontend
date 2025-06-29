import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { Router } from '@angular/router';
import { ValidateOtpPayload } from 'src/app/shared/models/validate-otp.model';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EncryptionService } from 'src/app/core/utils/encryption.service';

@Component({
  selector: 'app-2fa',
  templateUrl: './2fa.component.html',
  styleUrls: ['./2fa.component.scss']
})
export class TwoFaComponent implements OnDestroy {
  otpForm: FormGroup;
  isLoading = false;
  errorMsg = '';
  emailAddress = '';
  timeLeft = 300; // 5 minutes in seconds
  canResend = false;
  resendCooldown = 0;
  private timerSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private helper: EncryptionService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
    });

    // Get email from encrypted storage
    const details = this.helper.GetItem('user')?.data;
    this.emailAddress = details?.email || details?.user?.email || '';

    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.canResend = true;
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  resendCode() {
    if (!this.canResend || this.resendCooldown > 0) return;

    // Reset timer and start cooldown
    this.timeLeft = 300;
    this.canResend = false;
    this.resendCooldown = 30;

    // Start resend cooldown timer
    interval(1000).pipe(
      take(31)
    ).subscribe(() => {
      if (this.resendCooldown > 0) {
        this.resendCooldown--;
      }
    });

    this.startTimer();

    // TODO: Implement actual resend API call
    // this.loginService.resendOtp(this.emailAddress).subscribe(...);
  }

  submitOtp() {
    if (this.otpForm.invalid) return;
    this.isLoading = true;
    this.errorMsg = '';
    const payload: ValidateOtpPayload = {
      emailAddress: this.emailAddress,
      otp: this.otpForm.value.otp
    };
    this.loginService.validateOtp(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess) {
          this.router.navigate(['/user-management']);
        } else {
          this.errorMsg = res.errorMessage || 'Invalid OTP';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Network or server error';
      }
    });
  }
}
