import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { ReusableTableComponent } from './components/reusable-table/reusable-table.component';
import { AddUserModalComponent } from './components/modals/add-user-modal/add-user-modal.component';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from './components/inputs/search-input/search-input.component';
import { DropdownButtonComponent } from './components/buttons/dropdown-button/dropdown-button.component';
import { RemoveAuditComponent } from './components/modals/audit-plan-modals/remove-audit/remove-audit.component';
import { UpdateStatusComponent } from './components/modals/audit-plan-modals/update-status/update-status.component';



@NgModule({
  declarations: [TextInputComponent, ReusableTableComponent, HeaderComponent, AddUserModalComponent, SearchInputComponent, DropdownButtonComponent, RemoveAuditComponent, UpdateStatusComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  exports: [TextInputComponent, ReusableTableComponent, HeaderComponent, SearchInputComponent, DropdownButtonComponent], 
})
export class SharedModule {}
