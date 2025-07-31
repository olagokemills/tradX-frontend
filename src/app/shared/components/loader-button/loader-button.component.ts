import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader-button',
  templateUrl: './loader-button.component.html',
  styleUrls: ['./loader-button.component.scss']
})
export class LoaderButtonComponent {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() btnClass: string = 'btn btn-primary w-100';
  @Input() spinnerClass: string = 'spinner-border spinner-border-sm me-2';
  @Input() loaderText: string = 'Loading...';
  @Input() text: string = 'Submit';
  @Input() icon?: string; // Optional icon class
}
