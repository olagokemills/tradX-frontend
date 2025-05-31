import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password controls', () => {
    expect(component.LoginForm.contains('email')).toBeTrue();
    expect(component.LoginForm.contains('password')).toBeTrue();
  });

  it('should make the password control required', () => {
    const control = component.LoginForm.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalse();
    control?.setValue('somepassword');
    expect(control?.valid).toBeTrue();
  });

  it('should allow email to be empty (no validators)', () => {
    const control = component.LoginForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeTrue();
  });
});
