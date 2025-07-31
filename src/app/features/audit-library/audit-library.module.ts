import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditFindingsComponent } from './audit-findings/audit-findings.component';
import { AuditReportLibraryComponent } from './audit-report-library/audit-report-library.component';
import { SavedFindingsComponent } from './saved-findings/saved-findings.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  { path: 'findings', component: AuditFindingsComponent },
  { path: 'reports', component: AuditReportLibraryComponent },
  { path: 'saved-findings', component: SavedFindingsComponent },
];



import { AddReportFormComponent } from './components/add-report-form/add-report-form.component';
import { AddFindingFormComponent } from './components/add-finding-form/add-finding-form.component';

@NgModule({
  declarations: [
    AuditFindingsComponent,
    AuditReportLibraryComponent,
    SavedFindingsComponent,
    AddReportFormComponent,
    AddFindingFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class AuditLibraryModule { }
