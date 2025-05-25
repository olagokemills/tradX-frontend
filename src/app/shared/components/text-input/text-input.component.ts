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
      } // Add more error checks as needed
    }
    return 'Invalid input.';
  }
}
