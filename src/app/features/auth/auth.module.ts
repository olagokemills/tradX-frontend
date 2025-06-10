import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganizationDetailsComponent } from './onboarding/organization-details/organization-details.component';
import { RatingInfoComponent } from './onboarding/rating-info/rating-info.component';
import { ContactInfoComponent } from './onboarding/contact-info/contact-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionPlansComponent } from './onboarding/subscription-plans/subscription-plans.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
  },
];

@NgModule({
  declarations: [
    OnboardingComponent,
    LoginComponent,
    SignupComponent,
    OrganizationDetailsComponent,
    RatingInfoComponent,
    ContactInfoComponent,
    SubscriptionPlansComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class AuthModule {}
