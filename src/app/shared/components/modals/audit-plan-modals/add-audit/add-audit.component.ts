import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { UserService } from 'src/app/core/services/users.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import {
  CreateAuditPayload,
  Department,
} from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-add-audit',
  templateUrl: './add-audit.component.html',
  styleUrls: ['./add-audit.component.scss'],
})
export class AddAuditComponent implements OnInit {
  AddAuditForm!: FormGroup;
  Departments!: Department[];
  OrgId: string = '';
  loading: boolean = false;
  constructor(
    private dept: UserService,
    private api: AuditService,
    private fb: FormBuilder,
    private helper: EncryptionService,
    private utils: GenericService,
    public dialogRef: MatDialogRef<AddAuditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data, 'data from list');
  }
  ngOnInit(): void {
    this.GetDepts();
    this.GetDetails();

    this.AddAuditForm = this.fb.group({
      departmentId: ['', Validators.required],
      auditTitle: ['', Validators.required],
      proposedTiming: ['', Validators.required],
      organizationId: this.OrgId,
      auditScopeSummary: ['', Validators.required],
    });

    // Prefill form if in edit mode
    if (this.data?.mode === 'edit' && this.data?.audit) {
      const audit = this.data.audit;
      this.AddAuditForm.patchValue({
        departmentId: audit.departmentId,
        auditTitle: audit.auditTitle,
        proposedTiming: audit.proposedTiming
          ? new Date(`${audit.proposedTiming}-${audit.auditYear}`)
              .toISOString()
              .substring(0, 10)
          : '',
        auditScopeSummary: audit.auditScopeSummary,
      });
    }
  }

  GetDetails() {
    const details = this.helper.GetItem('user').data;
    this.OrgId = details?.user.organizationId;
    console.log(details, 'details here');
  }

  GetDepts() {
    this.dept.GetDept().subscribe({
      next: (res: any) => {
        this.Departments = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => {},
    });
  }

  CreateNewAudit(data: CreateAuditPayload) {
    this.loading = true;
    const payload: CreateAuditPayload = {
      departmentId: Number(data.departmentId),
      auditTitle: data.auditTitle,
      proposedTiming: new Date(data.proposedTiming).toISOString(),
      organizationId: this.data.organizationId,
      auditYear: this.data.auditYear,
      auditScopeSummary: data.auditScopeSummary,
    };
    console.log(payload, 'payload here');
    this.api.CreateAuditPlan(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.isSuccess) {
          this.utils.toastr.success(res.data.message);
          this.dialogRef.close();
        }
      },
      error: (err) => {
        this.utils.toastr.error(err.responseMessage);
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.AddAuditForm.invalid) return;
    const formValue = this.AddAuditForm.value;
    if (this.data?.mode === 'edit' && this.data?.audit) {
      // Edit mode: call update API with only required fields
      const payload = {
        auditPlanId: this.data.audit.auditPlanId,
        auditTitle: formValue.auditTitle,
        departmentId: Number(formValue.departmentId),
        status: this.data.audit.status,
        proposedTiming: new Date(formValue.proposedTiming).toISOString(),
        auditScopeSummary: formValue.auditScopeSummary,
      };
      this.loading = true;
      this.api.ModifyAudit(payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.isSuccess) {
            this.utils.toastr.success('Audit updated successfully');
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.utils.toastr.error(err.responseMessage || 'Update failed');
          this.loading = false;
        },
      });
    } else {
      // Create mode
      this.CreateNewAudit(formValue);
    }
  }
}
