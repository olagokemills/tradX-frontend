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
import { EditAuditComponent } from './components/modals/audit-plan-modals/edit-audit/edit-audit.component';
import { SelectInputComponent } from './components/inputs/select-input/select-input.component';
import { AddAuditComponent } from './components/modals/audit-plan-modals/add-audit/add-audit.component';
import { AddPlanComponent } from './components/modals/audit-plan-modals/add-plan/add-plan.component';
import { FullCanvasComponent } from './components/modals/full-canvas/full-canvas.component';
import { DigitInputComponent } from './components/digit-input/digit-input.component';

@NgModule({
  declarations: [
    TextInputComponent,
    ReusableTableComponent,
    HeaderComponent,
    AddUserModalComponent,
    SearchInputComponent,
    DropdownButtonComponent,
    RemoveAuditComponent,
    UpdateStatusComponent,
    EditAuditComponent,
    SelectInputComponent,
    AddAuditComponent,
    AddPlanComponent,
    FullCanvasComponent,
    DigitInputComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  exports: [
    TextInputComponent,
    ReusableTableComponent,
    HeaderComponent,
    SearchInputComponent,
    DropdownButtonComponent,
    EditAuditComponent,
    FullCanvasComponent,
    AddAuditComponent,
    DigitInputComponent,
  ],
})
export class SharedModule { }
