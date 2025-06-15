import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/users.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import {
  CreateUserPayload,
  Department,
  Role,
} from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {
  addUserForm!: FormGroup;
  roles!: Role[];
  Departments!: Department[];
  OrgId: string = '';
  OrgRoles: any;
  loading: boolean = false;
  ngOnInit(): void {
    this.GetDetails();
    this.GetRoles();
    this.GetDepts();
    this.GetOrgRoles();
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleId: ['', Validators.required],
      department: ['', Validators.required],
      organizationId: [this.OrgId],
      organizationRoleId: ['', Validators.required],
      countryId: [1],
    });
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    private api: UserService,
    private helper: EncryptionService
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  GetRoles() {
    this.api.GetOrgRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => {},
    });
  }

  GetOrgRoles() {
    this.api.GetUserRoles().subscribe({
      next: (res: any) => {
        this.OrgRoles = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => {},
    });
  }

  GetDepts() {
    this.api.GetDept().subscribe({
      next: (res: any) => {
        this.Departments = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => {},
    });
  }

  GetDetails() {
    const details = this.helper.GetItem('user').data;
    this.OrgId = details?.user.organizationId;
    console.log(details, 'details here');
  }
  onSubmit(values: CreateUserPayload) {
    const body = {
      ...values,
      organizationRoleId: Number(values.organizationRoleId),
    };
    this.api.CreateUser(body).subscribe((res) => {
      console.log(res, 'res here');
    });
  }
}
