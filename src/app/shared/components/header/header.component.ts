import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navItems = [
    { icon: 'home-icon.svg', label: 'Home', route: '/home' },
    { icon: 'note.svg', label: 'Reports', route: '/reports' },
    { icon: 'clipboard.svg', label: 'Audit Library', route: '/audit-library' },
    { icon: 'external-drive.svg', label: 'Audit Plan', route: '/audit-plan' },
    { icon: 'chart-square.svg', label: 'Insight', route: '/insights' },
    { icon: 'profile-2user.svg', label: 'Users', route: '/user-management' },
  ];
}
