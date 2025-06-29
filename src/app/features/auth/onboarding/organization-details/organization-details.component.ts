import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { OrganizationPayload } from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss'],
})
export class OrganizationDetailsComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() OrganizationDetails: any | null = null;
  OrganizationForm!: FormGroup;
  Countries: any;
  exchangeList: Array<any> = [];
  OrgId: string = '';

  numberOfEmployees: string[] = ['1 - 50', '50 - 100', '101 - 200'];
  annualTurnOver: string[] = ['50m', '100m', '200m'];
  industry: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private helper: EncryptionService,
    private api: LoginService
  ) { }

  ngOnInit(): void {
    this.populateForm();
    this.GetCountries();
    this.GetExchanges();
    this.GetIndustries();
    this.GetDetails();
    this.watchExchangeTypes();
    this.watchGroupMemberChanges();
  }

  private createGroupOrganizationFormGroup(): FormGroup {
    return this.fb.group({
      isGroup: [false],
      groupOrganizationName: ['', Validators.required],
      // companyRelationType is only used internally to determine isGroup value
      companyRelationType: ['', Validators.required]
    });
  }

  get groupOrganizations() {
    return this.OrganizationForm.get('groupOrganizations') as FormArray;
  }

  getGroupOrganizationForm(index: number): FormGroup {
    return this.groupOrganizations.at(index) as FormGroup;
  }

  addGroupOrganization() {
    this.groupOrganizations.push(this.createGroupOrganizationFormGroup());
  }

  removeGroupOrganization(index: number) {
    if (this.groupOrganizations.length > 1) {
      this.groupOrganizations.removeAt(index);
    }
  }

  private watchGroupMemberChanges() {
    this.OrganizationForm.get('groupMember')?.valueChanges.subscribe((isGroupMember) => {
      const isTrue = isGroupMember === 'true';

      if (isTrue) {
        // Add default group organization if none exists
        if (this.groupOrganizations.length === 0) {
          this.addGroupOrganization();
        }
      } else {
        // Clear all group organizations when set to false
        while (this.groupOrganizations.length) {
          this.groupOrganizations.removeAt(0);
        }
      }
    });
  }

  populateForm() {
    this.OrganizationForm = this.fb.group({
      companyName: [
        this.OrganizationDetails?.companyName || '',
        [Validators.minLength(6), Validators.required],
      ],
      exchangesList: [],
      preferredName: [
        this.OrganizationDetails?.psuedoName || '',
        [Validators.minLength(6), Validators.required],
      ],
      primaryDomain: [
        this.OrganizationDetails?.primaryDomain || '',
        [Validators.minLength(6), Validators.required],
      ],
      countryId: [
        this.OrganizationDetails?.country || '',
        [Validators.required],
      ],
      address: [
        this.OrganizationDetails?.companyAddress || '',
        [Validators.minLength(6), Validators.required],
      ],
      zipCode: [
        this.OrganizationDetails?.postCode || '',
        [Validators.minLength(6), Validators.required],
      ],
      exchangeListed: ['false'],
      numberOfEmployees: ['', Validators.required],
      annualTurnOver: ['', Validators.required],
      groupMember: ['false'],
      individualCompany: [true],
      industry: ['', Validators.required],
      groupOrganizations: this.fb.array([])
    });
  }
  private watchExchangeTypes() {
    this.OrganizationForm.get('exchangeListed')?.valueChanges.subscribe(
      (isListed) => {
        const exchangesControl = this.OrganizationForm.get('exchangesList');
        if (isListed === true) {
          exchangesControl?.setValidators([Validators.required]);
        } else {
          exchangesControl?.clearValidators();
          exchangesControl?.setValue(null);
        }
        exchangesControl?.updateValueAndValidity();
      }
    );
  }
  // Removed duplicate method setupGroupMemberValidation as it's identical to watchGroupMemberChanges

  get orgForm() {
    return this.OrganizationForm?.controls;
  }
  GetDetails() {
    // Always get orgId from localStorage
    this.OrgId = localStorage.getItem('organizationId') || '';
  }
  handleSubmit(data: any) {
    console.log(this.OrganizationForm, 'organization details form data');
    if (!this.OrganizationForm.valid) {
      Object.keys(this.OrganizationForm.controls).forEach(key => {
        const control = this.OrganizationForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formValue = this.OrganizationForm.value;

    // Create the body object exactly matching the OrganizationPayload interface
    const body: OrganizationPayload = {
      companyId: this.OrgId,
      companyName: formValue.companyName,
      preferredName: formValue.preferredName,
      exchangeListed: formValue.exchangeListed === 'true',
      exchangesList: formValue.exchangesList || [],
      primaryDomain: formValue.primaryDomain,
      countryId: Number(formValue.countryId),
      address: formValue.address,
      numberOfEmployees: formValue.numberOfEmployees,
      annualTurnOver: formValue.annualTurnOver,
      zipCode: formValue.zipCode,
      industry: formValue.industry,
      groupMember: formValue.groupMember === 'true',
      individualCompany: formValue.individualCompany,
      // Map form array to match the GroupOrganization interface exactly
      groupOrganizations: formValue.groupMember === 'true' ?
        formValue.groupOrganizations.map((org: any) => ({
          isGroup: org.companyRelationType === 'main',
          groupOrganizationName: org.groupOrganizationName
          // No other properties - strictly following the interface
        })) : []
    };

    // console.log(body, 'final submission');

    this.api.SaveCompanyOnboardingInfo(body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.formSubmit.emit('success');
        }
      },
      error: (error) => {
        console.error('Error saving company info:', error);
      }
    });
  }

  GetCountries() {
    this.api.GetCountries().subscribe((res) => {
      this.Countries = res.data;
    });
  }
  GetExchanges() {
    this.api.GetExchanges().subscribe((res) => {
      this.exchangeList = res.data;
    });
  }

  GetIndustries() {
    this.api.GetIndustries().subscribe((res) => {
      this.industry = res.data;
    });
  }
}
