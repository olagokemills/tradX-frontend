import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { OrganizationPayload } from 'src/app/shared/models/appData.model';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss'],
})
export class OrganizationDetailsComponent implements OnInit, OnChanges {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() OrganizationDetails: any | null = null;
  @Input() companyInformation: any | null = null; // Added input for company information
  OrganizationForm!: FormGroup;
  Countries: any;
  exchangeList: Array<any> = [];
  OrgId: string = '';

  numberOfEmployees: string[] = ['1 -50', '50 - 100', '101 - 200'];
  annualTurnOver: string[] = ['10m - 50m', '50m - 100m', '100m - 200m'];
  industry: Array<any> = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: LoginService,
    private utils: GenericService
  ) {}

  ngOnInit(): void {
    this.populateForm();
    this.GetCountries();
    this.GetExchanges();
    this.GetIndustries();
    this.GetDetails();
    this.watchExchangeTypes();
    this.watchGroupMemberChanges();
  }
  ngOnChanges(): void {
    setTimeout(() => {
      if (this.companyInformation) {
        console.log('Company Information:', this.companyInformation);
        this.OrganizationForm.patchValue({
          companyName:
            this.companyInformation.data.organizations[0].companyName || '',
        });
      }
    }, 1500);
  }

  private createGroupOrganizationFormGroup(): FormGroup {
    return this.fb.group({
      isGroup: [false],
      groupOrganizationName: ['', Validators.required],
      // companyRelationType is only used internally to determine isGroup value
      companyRelationType: ['', Validators.required],
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
    if (this.groupOrganizations.length === 1) {
      // Set the first group organization as the main company by default
      this.groupOrganizations.at(0).patchValue({
        isGroup: true,
        companyRelationType: 'main',
        groupOrganizationName:
          this.companyInformation.data.organizations[0].companyName || '',
      });
    }
  }

  removeGroupOrganization(index: number) {
    if (this.groupOrganizations.length > 1) {
      this.groupOrganizations.removeAt(index);
    }
  }

  private watchGroupMemberChanges() {
    this.OrganizationForm.get('groupMember')?.valueChanges.subscribe(
      (isGroupMember) => {
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
      }
    );
  }

  populateForm() {
    this.OrganizationForm = this.fb.group({
      companyName: [
        this.OrganizationDetails?.companyName || '',
        [Validators.minLength(3), Validators.required],
      ],
      exchangesList: [],
      preferredName: [
        this.OrganizationDetails?.psuedoName || '',
        [Validators.minLength(3), Validators.required],
      ],
      primaryDomain: [
        this.OrganizationDetails?.primaryDomain || '',
        [Validators.minLength(3), Validators.required],
      ],
      countryId: [
        this.OrganizationDetails?.country || '',
        [Validators.required],
      ],
      address: [
        this.OrganizationDetails?.companyAddress || '',
        [Validators.minLength(3), Validators.required],
      ],
      zipCode: [
        this.OrganizationDetails?.postCode || '',
        [Validators.minLength(3), Validators.required],
      ],
      exchangeListed: ['false'],
      numberOfEmployees: ['', Validators.required],
      annualTurnOver: ['', Validators.required],
      groupMember: ['false'],
      individualCompany: [true],
      industry: ['', Validators.required],
      groupOrganizations: this.fb.array([]),
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
    this.loading = true;
    if (!this.OrganizationForm.valid) {
      Object.keys(this.OrganizationForm.controls).forEach((key) => {
        const control = this.OrganizationForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.loading = false;
      return;
    }

    const formValue = this.OrganizationForm.value;
    //check that not more than two sub-organizations are added as main company in the groupOrganizations array
    const mainCompanies = formValue.groupOrganizations.filter(
      (org: any) => org.companyRelationType === 'main'
    );
    console.log('Main Companies:', mainCompanies.length);
    if (mainCompanies.length < 1) {
      this.loading = false;
      this.utils.toastr.error('You must add at leas one main company');
      return;
    }
    if (mainCompanies.length > 1) {
      this.loading = false;
      this.utils.toastr.error(
        'You can only add one main company in the group organizations.'
      );
      return;
    }
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
      groupOrganizations:
        formValue.groupMember === 'true'
          ? this.removeFirstGroupOrganization()
          : [],
    };

    this.api.SaveCompanyOnboardingInfo(body).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.formSubmit.emit('success');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error saving company info:', error);
      },
    });
  }

  removeFirstGroupOrganization() {
    //remove the first group organization if theres a list of group organization
    const formValue = this.OrganizationForm.value;
    const groups = formValue.groupOrganizations.map((org: any) => ({
      isGroup: org.companyRelationType === 'main',
      groupOrganizationName: org.groupOrganizationName,
    }));
    return groups; // Remove the first group organization
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
