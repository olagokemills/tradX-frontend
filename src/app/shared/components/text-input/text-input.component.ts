import { Component, Input, forwardRef } from '@angular/core';
import { AbstractControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() controlName!: string;
  @Input() placeholder!: string;
  @Input() type: string = 'text';
  @Input() formGroup!: FormGroup;
  @Input() iconSrc: string = '';
  @Input() disabled: boolean = false;

  value: any = '';
  isPasswordVisible: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() { }
  ngOnInit(): void { }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }

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
