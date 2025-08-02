import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { LoaderButtonComponent } from './components/loader-button/loader-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/modals/confirm-dialog/confirm-dialog.component';
import { EditColumnsDialogComponent } from './components/modals/edit-columns-dialog/edit-columns-dialog.component';
import { FilterDialogComponent } from './components/modals/filter-dialog/filter-dialog.component';
import { ViewFindingDialogComponent } from './components/modals/view-finding-dialog/view-finding-dialog.component';
import { EditFindingDialogComponent } from './components/modals/edit-finding-dialog/edit-finding-dialog.component';
import { SideModalComponent } from './components/side-modal/side-modal.component';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    TextInputComponent,
    ReusableTableComponent,
    HeaderComponent,
    SideModalComponent,
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
    LoaderButtonComponent,
    ConfirmDialogComponent,
    EditColumnsDialogComponent,
    FilterDialogComponent,
    ViewFindingDialogComponent,
    EditFindingDialogComponent,
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  exports: [
    TextInputComponent,
    ReusableTableComponent,
    HeaderComponent,
    SideModalComponent,
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
    LoaderButtonComponent,
    ConfirmDialogComponent,
    EditColumnsDialogComponent,
    FilterDialogComponent,
    ViewFindingDialogComponent,
    EditFindingDialogComponent,
    DateFormatPipe,
  ]
})
export class SharedModule { }
