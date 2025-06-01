import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserModalComponent } from 'src/app/shared/components/modals/add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  dialog = inject(MatDialog);
  UsersList: Array<any> = [
    {
      name: 'Layon Pan',
      email: 'Layon@gmail.com',
      role: 'Head Of Account',
      department: 'Accounting',
      permissions: 'Administrator',
    },
    {
      name: 'Guy Johnston',
      email: 'm.hopkins@hotmail.com',
      role: 'Chief Executive Officer',
      department: 'All',
      permissions: 'Executives',
    },
    {
      name: 'Brett Lucas',
      email: 'jose.woods@msn.com',
      role: 'Auditor',
      department: 'Accounting',
      permissions: 'Priviledge Users',
    },
  ];

  constructor() {}

  OpenModal() {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  viewUser() {}
}
