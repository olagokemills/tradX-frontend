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
  OrganizationsRoles,
  Permission,
  Role,
  UserData,
  UserRoles,
} from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {
  addUserForm!: FormGroup;
  roles!: OrganizationsRoles[];
  Departments!: Department[];
  OrgId: string = '';
  OrgRoles: UserRoles[] = [];

  loading: boolean = false;
  pageName: string = '';
  userStatus: string = '';
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
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      department: ['', Validators.required],
      organizationId: [],
      organizationRoleId: ['', Validators.required],
      countryId: [1],
    });
    this.checkPageName(this.data);
    // console.log(this.s);
  }

  checkPageName(data?: { body: any; action: string }) {
    console.log(data, 'data here');
    if (data) {
      if (data?.action === 'Delete') {
        this.pageName = 'Delete User';
        return;
      }
      if (data?.action === 'Toggle') {
        this.pageName = 'Toggle User';
      } else if (data?.action === 'Edit') {
        this.pageName = 'Edit User';
        setTimeout(() => {
          this.UpdateFormFields();
        }, 3500);
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
      },
      error: (err) => {},
    });
  }

  GetOrgRoles() {
    this.api.GetUserRoles().subscribe({
      next: (res: any) => {
        this.OrgRoles = res.data;
      },
      error: (err) => {},
    });
  }

  GetDepts() {
    this.api.GetDept().subscribe({
      next: (res: any) => {
        this.Departments = res.data;
      },
      error: (err) => {},
    });
  }

  GetDetails() {
    const Org = JSON.parse(sessionStorage.getItem('organizationInfo')!);
    this.OrgId = Org?.data.organizations[0].companyId;
  }

  onSubmit(values: CreateUserPayload) {
    const body = {
      ...values,
      organizationRoleId: Number(values.organizationRoleId),
      organizationId: this.OrgId,
    };
    this.loading = true;
    if (this.pageName === 'Edit User') {
      this.modifyUser({
        ...body,
        userId: this.data.userData.userId,
        department: String(body.department),
      });
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
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  UpdateFormFields() {
    const user = this.data.userData;
    this.addUserForm.patchValue({
      firstName: user.fullname.split(' ')[0] || '',
      lastName: user.fullname.split(' ')[1] || '',
      emailAddress: user.email || '',
      password: user.password || '',
      department: this.returnMappedDepartments(user.department) || '',
      organizationRoleId: this.returnMappedRole(user.organizationRole) || '',
      roleId: this.returnMappedPermissions(user.permission) || '',
      countryId: 1,
      phoneNumber: user.phoneNumber || '12344567890',
    });
    this.addUserForm.get('password')?.removeValidators([Validators.required]);
    this.addUserForm
      .get('phoneNumber')
      ?.removeValidators([Validators.required]);
    this.addUserForm.updateValueAndValidity();
    this.addUserForm.updateValueAndValidity();
  }

  returnMappedDepartments(deptName: string) {
    const dept = this.Departments.find((d: any) => d.name === deptName);
    return dept ? dept.id : '';
  }
  returnMappedRole(roleName: string) {
    const role = this.roles.find(
      (r: OrganizationsRoles) =>
        r.roleName.trim().toLowerCase() === roleName.trim().toLowerCase()
    );
    return role ? role.id : '';
  }
  returnMappedPermissions(permissionName: string) {
    const permission = this.OrgRoles.find(
      (p: UserRoles) => p.roleName === permissionName
    );
    return permission ? permission.roleId : '';
  }

  modifyUser(data: any) {
    this.loading = true;
    this.api.ModifyUser(data).subscribe(
      (res) => {
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

  onUserStatusChange() {
    this.loading = true;
    const body = {
      userStatus: this.userStatus,
      userId: this.data.userData.userId,
    };
    console.log(body, 'body here');
    this.api.ModifyUserStatus(body).subscribe(
      (res) => {
        this.loading = false;
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
  onDeleteUser() {
    this.loading = true;
    const userId = this.data.userData.userId;
    this.api.DeleteUser(userId).subscribe(
      (res) => {
        this.loading = false;
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
}
