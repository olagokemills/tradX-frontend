import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { first } from 'rxjs';
import { Role } from 'src/app/shared/models/appData.model';
import { UserService } from 'src/app/core/services/users.service';
@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() ContactInfo: any | null = null;
  Details!: any;
  ContactForm!: FormGroup;
  fullName: string = '';
  roles!: Role[];
  OrgRoles!: any;
  logoPreview: string | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

  constructor(
    private fb: FormBuilder,
    private api: LoginService,
    private helper: EncryptionService,
    private user: UserService
  ) {
    this.GetDetails();
  }

  ngOnInit(): void {
    this.populateForm();
    this.GetOrgRoles();
    this.GetRoles();
  }
  GetDetails() {
    const details = this.helper.GetItem('user').data;
    this.fullName = details?.user.fullname;
    this.Details = details.user;
    console.log(this.Details, 'details hre');
  }

  GetRoles() {
    this.user.GetOrgRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => { },
    });
  }
  GetOrgRoles() {
    this.user.GetUserRoles().subscribe({
      next: (res: any) => {
        this.OrgRoles = res.data;
        console.log(res, 'roles here');
      },
      error: (err) => { },
    });
  }
  populateForm() {
    this.ContactForm = this.fb.group({
      fullName: [
        this.ContactInfo?.fullName || '',
        [Validators.minLength(6), Validators.required],
      ],
      emailAddress: [
        this.ContactInfo?.emailAddress || '',
        [Validators.minLength(6), Validators.required],
      ],
      phoneNumber: [
        this.ContactInfo?.phoneNumber || '',
        [Validators.minLength(6), Validators.required],
      ],
      roleId: [
        this.ContactInfo?.role || '',
        [Validators.minLength(6), Validators.required],
      ],
      organizationRoleId: [0, [Validators.minLength(6), Validators.required]],
      logo: [null],
    });

    if (this.Details?.fullname) {
      console.log(this.Details, 'details heer');
      this.ContactForm.patchValue({
        fullName: this.Details.fullname,

        emailAddress: this.Details.email || '',
        countryId: 1,
      });
    }
  }
  handleSubmit(data: any) {
    const formData = new FormData();
    const payload = {
      ...data,
      countryId: 1,
      organizationId: this.Details.organizationId,
      firstName: this.Details.fullname || '',
      lastName: this.Details.fullname || '',
      organizationRoleId: Number(data.organizationRoleId),
    };

    // Append all form data
    Object.keys(payload).forEach(key => {
      if (key !== 'logo') {
        formData.append(key, payload[key]);
      }
    });

    // Append logo if exists
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    //     {
    //   "organizationId": "string",
    //   "firstName": "iKvqx.DID.28eMJFkgSvx0O8T2FWuC",
    //   "lastName": "yCLqh03,fb8GKBpWeJHYosSxbtpbdXyI4BhQ6X3Mecmde",
    //   "emailAddress": "hDLsX5Sbe@jM:s!FdtoL%II2^c9&OqEdXQ<*[5)8$,W*=^muWD8\\#*|JR%;CM<~dy7FK\\>x.r~xv2vCfLfPwe87yy]Z.v1s-=7=,4r8GPS`Xgb/~U",
    //   "countryId": 0,
    //   "phoneNumber": "74289065220",
    //   "roleId": "string",
    //   "organizationRoleId": 0
    // }
    this.api.saveContactInformation(payload).subscribe((res) => {
      console.log(res, 'res from contact');
    });
    this.formSubmit.emit(this.ContactInfo);
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > this.maxFileSize) {
      alert('File is too large. Maximum size is 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logoPreview = e.target.result;
      this.ContactForm.patchValue({
        logo: file,
      });
    };
    reader.readAsDataURL(file);
  }

  removeLogo() {
    this.logoPreview = null;
    this.ContactForm.patchValue({
      logo: null,
    });
  }
}
