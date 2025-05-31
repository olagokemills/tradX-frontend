import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from './text-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextInputComponent],
    });
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
describe('TextInputComponent logic', () => {
  let component: TextInputComponent;

  beforeEach(() => {
    component = new TextInputComponent();
    component.formGroup = new FormGroup({
      testInput: new FormControl('', []),
    });
    component.controlName = 'testInput';
  });

  it('should return false from shouldDisplayError if control is untouched', () => {
    const control = component.formGroup.get('testInput');
    control?.setErrors({ required: true });
    expect(component.shouldDisplayError()).toBeFalse();
  });

  it('should return true from shouldDisplayError if control is touched and invalid', () => {
    const control = component.formGroup.get('testInput');
    control?.setErrors({ required: true });
    control?.markAsTouched();
    expect(component.shouldDisplayError()).toBeTrue();
  });

  it('should return false from shouldDisplayError if control is touched and valid', () => {
    const control = component.formGroup.get('testInput');
    control?.setValue('valid');
    control?.markAsTouched();
    expect(component.shouldDisplayError()).toBeFalse();
  });

  it('should return required error message', () => {
    const control = component.formGroup.get('testInput');
    control?.setErrors({ required: true });
    expect(component.getErrorMessage()).toBe('This field is required.');
  });

  it('should return pattern error message', () => {
    const control = component.formGroup.get('testInput');
    control?.setErrors({ pattern: true });
    expect(component.getErrorMessage()).toBe('Invalid format.');
  });

  it('should return default error message for unknown error', () => {
    const control = component.formGroup.get('testInput');
    control?.setErrors({ someOtherError: true });
    expect(component.getErrorMessage()).toBe('Invalid input.');
  });

  it('should return default error message if no errors', () => {
    const control = component.formGroup.get('testInput');
    control?.setErrors(null);
    expect(component.getErrorMessage()).toBe('Invalid input.');
  });

  it('should return default error message if control does not exist', () => {
    component.controlName = 'nonExistent';
    expect(component.getErrorMessage()).toBe('Invalid input.');
  });
});
