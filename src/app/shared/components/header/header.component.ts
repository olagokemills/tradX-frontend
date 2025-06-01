import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navItems = [
    { icon: 'home-icon.svg', label: 'Home', },
    { icon: 'note.svg', label: 'Reports', },
    { icon: 'clipboard.svg', label: 'Audit Library',  },
    { icon: 'external-drive.svg', label: 'Audit Plan',  },
    { icon: 'chart-square.svg', label: 'Insight',  },
    { icon: 'profile-2user.svg', label: 'Users',  },
  ];
}
