import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-digit-input',
  template: `
    <div class="digit-input-container">
      <input
        *ngFor="let box of boxes; let i = index"
        type="text"
        maxlength="1"
        class="digit-box"
        [value]="value[i] || ''"
        (input)="onInput($event, i)"
        (keydown)="onKeyDown($event, i)"
        (paste)="onPaste($event)"
        #digitInput
      />
    </div>
  `,
  styles: [`
    .digit-input-container {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .digit-box {
      width: 3.5rem;
      height: 4rem;
      font-size: 1.5rem;
      text-align: center;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      background: white;
      transition: all 0.2s;
      outline: none;
    }

    .digit-box:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DigitInputComponent),
      multi: true
    }
  ]
})
export class DigitInputComponent implements ControlValueAccessor {
  boxes = new Array(5);
  value: string = '';
  disabled: boolean = false;
  onChange = (value: string) => { };
  onTouch = () => { };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let newValue = this.value.split('');
    newValue[index] = input.value.slice(-1);
    this.value = newValue.join('');
    this.onChange(this.value);
    this.onTouch();

    // Move to next input if value is entered
    if (input.value && index < this.boxes.length - 1) {
      const nextInput = input.parentElement?.querySelector(`input:nth-child(${index + 2})`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.value[index] && index > 0) {
      const prevInput = (event.target as HTMLElement).parentElement?.querySelector(`input:nth-child(${index})`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (!pastedData) return;

    const digits = pastedData.replace(/\D/g, '').slice(0, this.boxes.length);
    this.value = digits;
    this.onChange(this.value);
    this.onTouch();
  }
}
