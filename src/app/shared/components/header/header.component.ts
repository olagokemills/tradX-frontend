import { Component, HostListener } from '@angular/core';
import { UserService } from 'src/app/core/services/users.service';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navItems = [
    { icon: 'home-icon.svg', label: 'Home', route: '/home' },
    { icon: 'note.svg', label: 'Reports', route: '/reports' },
    {
      icon: 'clipboard.svg',
      label: 'Audit Library',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Audit Findings', route: '/audit-library/findings' },
        { label: 'Audit Report Library', route: '/audit-library/reports' },
        { label: 'Saved Findings', route: '/audit-library/saved-findings' },
      ]
    },
    { icon: 'external-drive.svg', label: 'Audit Plan', route: '/audit-plan' },
    { icon: 'chart-square.svg', label: 'Insight', route: '/insights' },
    { icon: 'profile-2user.svg', label: 'Users', route: '/user-management' },
  ];

  activeDropdown: string | null = null;
  activeMobileDropdown: string | null = null;
  logoString: string = '';
  userDetails: any = null;
  userName: string = '';
  userEmail: string = '';
  userRole: string = '';
  companyName: string = '';
  companyInitials: string = '';

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private encryptionService: EncryptionService
  ) {
    // Initialization logic if needed
    this.fetchUserLogo();
    this.fetchUserDetails();
  }

  fetchUserLogo() {
    const Org = JSON.parse(sessionStorage.getItem('organizationInfo')!);
    const OrgId = Org?.data.organizations[0].companyId;
    console.log(OrgId, 'org id here');
    this.userService.FetchOrganizationLogo(OrgId).subscribe({
      next: (res) => {
        this.logoString = res.data.message; // Assuming the logo is returned in this format
        console.log('Logo fetched successfully:', res);
        if (res && res.data && res.data.logo) {
          return res.data.logo; // Assuming the logo is returned in this format
        }
        return 'default-logo.png'; // Fallback logo if none is found
      },
      error: (err) => {
        console.error('Error fetching logo:', err);
        return 'default-logo.png'; // Fallback logo in case of error
      },
    });
  }

  fetchUserDetails() {
    // Get userId from localStorage or sessionStorage
    const userId = this.encryptionService.GetItem('user')?.data?.user?.userId;

    if (!userId) {
      console.warn('No user ID found in storage');
      // Try to get user info from stored login response
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.data) {
        this.setUserInfo(userInfo.data);
      }
      return;
    }

    this.loginService.getUserById(userId).subscribe({
      next: (response) => {
        console.log('User details fetched successfully:', response);
        if (response && response.data) {
          this.userDetails = response.data;
          this.setUserInfo(response.data);
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        // Fallback to stored user info if API call fails
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || '{}');
        if (userInfo && userInfo.data) {
          this.setUserInfo(userInfo.data);
        }
      }
    });
  }

  private setUserInfo(userData: any) {
    this.userName = userData.fullname || userData.firstName + ' ' + userData.lastName || 'User';
    this.userEmail = userData.email || userData.emailAddress || '';
    this.userRole = userData.role || userData.organizationRole || 'User';

    // Handle company information
    this.companyName = userData.companyName || userData.preferredName || 'Company';
    this.companyInitials = this.generateInitials(this.companyName);

    console.log('User Info:', userData);
    console.log('Company Name:', this.companyName);
    console.log('Company Initials:', this.companyInitials);
  }

  private generateInitials(companyName: string): string {
    if (!companyName) return 'LP';

    // Split the company name by spaces and take first letter of each word
    const words = companyName.trim().split(' ');

    if (words.length === 1) {
      // If single word, take first two letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // If multiple words, take first letter of first two words
      return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
    }
  }

  logout() {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = '/auth/login';
  }

  toggleDropdown(label: string) {
    this.activeDropdown = this.activeDropdown === label ? null : label;
  }

  toggleMobileDropdown(label: string) {
    this.activeMobileDropdown = this.activeMobileDropdown === label ? null : label;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.nav-item-container') || target.closest('.profile-container');

    if (!clickedInside) {
      this.activeDropdown = null;
    }
  }
}
