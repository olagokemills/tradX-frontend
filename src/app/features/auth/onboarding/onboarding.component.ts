import { Component } from '@angular/core';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { OrganizationPayload } from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  pageName: string = '1';
  ratingInfo: any | null = null;
  organizationDetails: any | null = null;
  contactInfo: any | null = null;
  SubscriptionDetails: any | null = null;

  constructor(private api: LoginService) { }

  ngOnInit(): void { }
  handleContactInfo(data: Record<string, any>) { }
  handleRatingInfo(data: Record<string, any>) { }
  handleOrganizationDetails(data: OrganizationPayload) {
    console.log(data.exchangeName, 'final submission');
    this.api.SaveCompanyOnboardingInfo(data).subscribe((res) => {
      console.log(res);
    });
  }
  handleSubscriptionDetails(data: Record<string, any>) { }

  handlePageChange(page: string) {
    this.pageName = page;
  }
}
