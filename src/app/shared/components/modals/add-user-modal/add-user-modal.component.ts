import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/users.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import {
  CreateUserPayload,
  Department,
  ModifyStatusPayload,
  Role,
  UserData,
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
  pageName: string = '';
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    private api: UserService,
    private helper: EncryptionService,
    private utils: GenericService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.GetDetails();
    this.GetRoles();
    this.GetDepts();
    this.GetOrgRoles();
    console.log(this.data, 'data form listt');
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      department: ['', Validators.required],
      organizationId: [this.OrgId],
      organizationRoleId: ['', Validators.required],
      countryId: [1],
    });
    this.checkPageName(this.data);
  }

  checkPageName(data?: { body: any; action: string }) {
    if (data) {
      if (data?.action === 'Toggle') {
        this.pageName = 'Toggle User';
      } else if (data?.action === 'Edit') {
        this.pageName = 'Edit User';
        this.UpdateFormFields();
      } else {
        this.pageName = 'Create User';
      }
    } else {
      this.pageName = 'Create User';
    }
  }
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
    this.loading = true;
    if (this.pageName === 'Edit User') {
      this.modifyUser({ ...body, userId: this.data.userData.userId });
      return;
    }

    this.api.CreateUser(body).subscribe(
      (res) => {
        if (res.isSuccess) {
          this.utils.toastr.success(res.data.message, res.responseMessage);
          this.dismissModal();
        } else {
          this.utils.toastr.error(res.responseMessage);
        }
        console.log(res, 'res here');
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  UpdateFormFields() {
    console.log(this.data.userData, 'data in formmmmm');
    const user = this.data.userData;
    console.log(user, 'to be added');
    this.addUserForm.patchValue({
      firstName: user.fullname.split(' ')[0] || '',
      lastName: user.fullname.split(' ')[1] || '',
      phoneNumber: user.phoneNumber || '',
      emailAddress: user.email || '',
      password: user.password || '',
      roleId: user.roleId || '',
      department: user.department || '',
      organizationId: this.OrgId,
      organizationRoleId: user.organizationRoleId || '',
      countryId: 1,
    });
    this.addUserForm.get('password')?.removeValidators([Validators.required]);
    this.addUserForm.updateValueAndValidity();
    console.log(this.addUserForm.value);
  }

  // editUser(data:UserData){
  //      this.api.EditUser(body).subscribe((res) => {
  //     console.log(res, 'res here');
  //   });
  // }

  modifyUser(data: any) {
    this.api.ModifyUser(data).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        if (res.isSuccess) {
          this.utils.toastr.success(res.data.message, res.responseMessage);
          this.dismissModal();
        } else {
          this.utils.toastr.error(res.responseMessage);
        }
        this.utils.toastr.success(res.responseMessage);
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  ToggleUser(data: string) {
    const user: ModifyStatusPayload = {
      userId: this.data.userData.userId,
      userStatus: data,
    };
    this.api.ToggleUserstatus(user).subscribe(
      (res) => {
        if (res.isSuccess) {
          this.utils.toastr.success(res.data.message, res.responseMessage);
          this.dismissModal();
        } else {
          this.utils.toastr.error(res.responseMessage);
        }
        console.log(res, 'res here');
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  dismissModal() {
    this.dialogRef.close();
  }
}
