import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent {
  @Input() controlName!: string;
  @Input() placeholder!: string;
  @Input() type: string = 'text';
  @Input() formGroup!: FormGroup;
  @Input() iconSrc: string = '';
  isPasswordVisible: boolean = false;
  constructor() {}
  ngOnInit(): void {}

  shouldDisplayError(): boolean {
    const control: AbstractControl | null = this.formGroup.get(
      this.controlName
    );
    return control ? control.touched && control.invalid : false;
  }

  getErrorMessage(): string {
    const control: AbstractControl | null = this.formGroup.get(
      this.controlName
    );
    if (control && control.errors) {
      if (control.errors?.['required']) {
        return 'This field is required.';
      } else if (control.errors?.['pattern']) {
        return 'Invalid format.';
      } else if (control.errors?.['passwordStrength']) {
        return 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.';
        // const requiredLength =
        //   control.errors['passwordStrength'].requiredLength;
        // return `Minimum length is ${requiredLength} characters.`;
      }
    }
    return 'Invalid input.';
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
