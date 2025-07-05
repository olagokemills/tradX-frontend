import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { first } from 'rxjs';
import { Role, ContactInformationPayload } from 'src/app/shared/models/appData.model';
import { UserService } from 'src/app/core/services/users.service';
import { Store } from '@ngrx/store';
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
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: LoginService,
    private helper: EncryptionService,
    private user: UserService,
    private store: Store
  ) {
    this.GetDetails();
  }

  ngOnInit(): void {
    this.populateForm();
    this.GetOrgRoles();
    this.GetRoles();
    this.getLoginState();
  }

  getLoginState() {
    // Subscribe to the auth state from the store
    this.store.select((state: any) => state['auth']).subscribe(authState => {
      console.log('Current Auth State:', authState);
    });
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
        [Validators.required],
      ],
      organizationRoleId: [
        0,
        [Validators.required],
      ],
      logo: [null],
    });

    if (this.Details?.fullname) {
      // console.log(this.Details, 'details heer');
      this.ContactForm.patchValue({
        fullName: this.Details.fullname,

        emailAddress: this.Details.email || '',
        countryId: 1,
      });
    }
  }
  handleSubmit(data: any) {
    this.loading = true;
    // Get organizationId from localStorage or fallback to user details
    const organizationId = localStorage.getItem('organizationId') || '';

    const payload: ContactInformationPayload = {
      countryId: 1,
      organizationId: organizationId,
      firstName: this.Details.fullname || '',
      lastName: this.Details.fullname || '',
      emailAddress: data.emailAddress,
      phoneNumber: data.phoneNumber,
      roleId: data.roleId,
      organizationRoleId: Number(data.organizationRoleId),
    };

    // First, save contact information
    this.api.saveContactInformation(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // If contact info was saved successfully and we have a logo, upload it
          if (data.logo) {
            this.uploadLogo(data.logo, this.Details.organizationId);
          } else {
            this.formSubmit.emit('success');
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving contact information:', err);
        // Do not emit success on error
      }
    });
  }

  /**
   * Upload logo as a separate API call
   */
  uploadLogo(file: File, organizationId: string) {
    // Get organizationId from localStorage or use the provided fallback
    const orgId = localStorage.getItem('organizationCode') || organizationId;

    // Convert the file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Get base64 string without the data:image prefix
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1]; // Remove the data:image/jpeg;base64, part

      // Call the logo upload API
      this.api.uploadLogo(
        orgId,
        base64Content,
        file.name
      ).subscribe({
        next: (response) => {
          console.log('Logo uploaded successfully:', response);
          this.formSubmit.emit('success');
          this.loading = false;
        },
        error: (error) => {
          console.error('Error uploading logo:', error);
          this.formSubmit.emit(this.ContactInfo);
          this.loading = false;
        }
      });
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.formSubmit.emit(this.ContactInfo);
      this.loading = false;
    };
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
