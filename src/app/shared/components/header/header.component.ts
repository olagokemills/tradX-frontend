import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/users.service';

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
  logoString: string = '';
  constructor(
    private userService: UserService // Assuming you have a UserService to fetch user data
  ) {
    // Initialization logic if needed
    this.fetchUserLogo();
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

  toggleDropdown(label: string) {
    this.activeDropdown = this.activeDropdown === label ? null : label;
  }
}
