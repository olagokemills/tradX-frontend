import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { UserService } from 'src/app/core/services/users.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import {
  CreateAuditPayload,
  Department,
  UpdateAuditPayload,
} from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-edit-audit',
  templateUrl: './edit-audit.component.html',
  styleUrls: ['./edit-audit.component.scss'],
})
export class EditAuditComponent implements OnInit, OnChanges {
  EditForm!: FormGroup;
  loading: boolean = false;
  pageName: string = '';
  Departments!: Department[];
  newProposedTiming: string = '';
  constructor(
    private fb: FormBuilder,
    private api: AuditService,
    private utils: GenericService,
    private dept: UserService,
    public dialogRef: MatDialogRef<EditAuditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data, 'fata form modal');
  }

  ngOnChanges() {
    console.log(this.data, 'thanksss');
    this.UpdateFormFields();
  }

  ngOnInit(): void {
    this.GetDepts();
    this.EditForm = this.fb.group({
      department: [''],
      auditTitle: [''],
      proposedTiming: [''],
      auditType: [''],
    });
  }

  UpdateFormFields() {
    const auditData = this.data;
    this.EditForm.patchValue({
      auditTitle: auditData.auditTitle || '',
      department: auditData.department || '',
      proposedTiming: auditData.organizationRoleId || '',
      auditType: auditData.auditType || '',
    });
    console.log(this.EditForm.value, 'edit form here');
  }
  GetDepts() {
    this.dept.GetDept().subscribe({
      next: (res: any) => {
        this.Departments = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => { },
    });
  }
  onSubmit(data: UpdateAuditPayload) {
    this.api.ModifyAudit(data).subscribe((res) => {
      if (res.isSuccess) {
        this.utils.toastr.success(res.data.message);
      }
    });
  }
  modifyAuditTiming() {
    this.loading = true;
    const body = {
      auditPlanId: this.data.auditId,
      proposedTiming: new Date(this.newProposedTiming).toISOString(),
    };
    this.api.ModifyAuditTiming(body).subscribe((res) => {
      this.loading = false;
      if (res.isSuccess) {
        this.utils.toastr.success(res.data.message);
        this.loading = false;
        this.dismissModal();
      } else {
        this.utils.toastr.error(res.responseMessage);
      }
    });
  }

  dismissModal() {
    this.dialogRef.close();
  }
}
