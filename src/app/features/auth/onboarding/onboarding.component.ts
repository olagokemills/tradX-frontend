import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { OrganizationPayload } from 'src/app/shared/models/appData.model';
import { EncryptionService } from 'src/app/core/utils/encryption.service';

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
  isLoading: boolean = true; // Add loading state
  companyInformation: any | null = null; // add data or get from store later

  constructor(
    private api: LoginService,
    private helper: EncryptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user details from encrypted local/session storage
    const details = this.helper.GetItem('user')?.data;
    const userId = details?.user?.userId || details?.userId;
    if (userId) {
      this.isLoading = true; // Start loading
      this.api.getUserById(userId).subscribe({
        next: (res: any) => {
          // API returns organizations array inside data
          const organizations = res?.data?.organizations;
          if (organizations && organizations.length > 0) {
            const organizationId = organizations[0]?.companyId;
            const onboardingCompleted = organizations[0]?.onboardingCompleted;
            if (organizationId) {
              localStorage.setItem('organizationId', organizationId);
            }
            if (onboardingCompleted) {
              // Route to 2FA page if onboarding is completed
              this.router.navigate(['/auth/2fa']);
              return;
            }
            // else, stay on onboarding
          }
          this.isLoading = false; // Stop loading once we've processed the response
        },
        error: (err) => {
          console.error('Error fetching user by ID:', err);
          this.isLoading = false; // Stop loading on error
        },
      });
    } else {
      this.isLoading = false; // Stop loading if no userId
    }
    // Get organization details from session storage
    this.companyInformation = JSON.parse(
      sessionStorage.getItem('organizationInfo') || '{}'
    );
    console.log('Company Information:', this.companyInformation);
  }
  handleContactInfo(event: any) {
    if (event === 'success') {
      this.pageName = '3';
    }
  }

  handleRatingInfo(event: any) {
    if (event === 'success') {
      // If you have a 4th step, advance to it here
      // this.pageName = '4';
      // refresh the page
      this.router.navigate(['/user-management']);
    }
  }

  handleOrganizationDetails(event: any) {
    if (event === 'success') {
      this.pageName = '2';
    }
  }
  handleSubscriptionDetails(data: Record<string, any>) {}

  handlePageChange(page: string) {
    return null;
    this.pageName = page;
  }

  logout() {
    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();
    // Optionally, clear any other app state here
    // Redirect to login
    this.router.navigate(['/auth/login']);
  }
}
