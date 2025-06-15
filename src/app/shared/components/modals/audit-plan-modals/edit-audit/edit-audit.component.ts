import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { UserService } from 'src/app/core/services/users.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import {
  CreateAuditPayload,
  Department,
} from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-edit-audit',
  templateUrl: './edit-audit.component.html',
  styleUrls: ['./edit-audit.component.scss'],
})
export class EditAuditComponent implements OnInit, OnChanges {
  EditForm!: FormGroup;
  @Input() data: any = null;
  loading: boolean = false;
  Departments!: Department[];
  constructor(
    private fb: FormBuilder,
    private api: AuditService,
    private utils: GenericService,
    private dept: UserService
  ) {}

  ngOnChanges() {
    console.log(this.data, 'thanksss');
    this.UpdateFormFields();
  }

  ngOnInit(): void {
    console.log('are yuouf ');
    this.GetDepts();
    this.EditForm = this.fb.group({
      department: [''],
      auditTitle: [''],
      proposedTiming: [''],
      auditType: [''],
    });
  }

  UpdateFormFields() {
    console.log(this.data.userData, 'data in formmmmm');
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
      error: (err) => {},
    });
  }
  onSubmit(data: CreateAuditPayload) {
    this.api.ModifyAudit(data).subscribe((res) => {
      if (res.isSuccess) {
        this.utils.toastr.success(res.data.message);
      }
    });
  }
}
