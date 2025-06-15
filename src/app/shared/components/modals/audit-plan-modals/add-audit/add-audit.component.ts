import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    private utils: GenericService
  ) {}
  ngOnInit(): void {
    this.GetDepts();
    this.GetDetails();

    this.AddAuditForm = this.fb.group({
      departmentId: ['', Validators.required],
      auditTitle: ['', Validators.required],
      proposedTiming: ['', Validators.required],
      organizationId: this.OrgId,
    });
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
    this.api.CreateAuditPlan(data).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.isSuccess) {
          this.utils.toastr.success(res.data.message);
        }
      },
      error: (err) => {
        this.utils.toastr.error(err.responseMessage);
        this.loading = false;
      },
    });
  }
}
