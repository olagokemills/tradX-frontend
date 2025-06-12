import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Select Option';
  @Input() controlName: string = '';
  @Input() formGroup!: FormGroup;
}
