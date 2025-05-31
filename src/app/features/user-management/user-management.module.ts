import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [CommonModule, SharedModule],
})
export class UserManagementModule {}
