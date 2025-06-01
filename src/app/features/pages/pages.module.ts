import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
  },
];
@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    RouterModule.forChild(routes),
  ],
})
export class PagesModule {}
