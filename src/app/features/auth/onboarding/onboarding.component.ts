import { Component } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  pageName: string = '2';
  ratingInfo: any | null = null;
  organizationDetails: any | null = null;
  contactInfo: any | null = null;
  SubscriptionDetails: any | null = null;

  constructor() {}

  ngOnInit(): void {}
  handleContactInfo(data: Record<string, any>) {}
  handleRatingInfo(data: Record<string, any>) {}
  handleOrganizationDetails(data: Record<string, any>) {}
  handleSubscriptionDetails(data: Record<string, any>) {}

  handlePageChange(page: string) {
    this.pageName = page;
  }
}
