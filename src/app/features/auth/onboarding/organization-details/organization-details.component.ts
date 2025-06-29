import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';

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

  private watchGroupMemberChanges() {
    this.OrganizationForm.get('groupMember')?.valueChanges.subscribe((isGroupMember) => {
      const groupNameControl = this.OrganizationForm.get('groupOrganizationName');
      const relationTypeControl = this.OrganizationForm.get('companyRelationType');

      // Handle string 'true' and boolean true values
      const isTrue = isGroupMember === 'true';

      if (isTrue) {
        groupNameControl?.setValidators([Validators.required]);
        relationTypeControl?.setValidators([Validators.required]);
      } else {
        groupNameControl?.clearValidators();
        relationTypeControl?.clearValidators();
        groupNameControl?.setValue('');
        relationTypeControl?.setValue('');
      }

      groupNameControl?.updateValueAndValidity();
      relationTypeControl?.updateValueAndValidity();
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
        [Validators.minLength(6), Validators.required],
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
      groupOrganizationName: [''],
      companyRelationType: [''],
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
    const details = this.helper.GetItem('user').data;
    this.OrgId = details?.user.organizationId;
  }
  handleSubmit(data: any) {
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
    const body = {
      ...formValue,
      countryId: Number(formValue.countryId),
      companyId: this.OrgId,
      exchangesList: formValue.exchangesList ?? [0],
      groupMember: formValue.groupMember === 'true',
      exchangeListed: formValue.exchangeListed === 'true',
      ...(formValue.groupMember === 'true' && {
        groupOrganizationName: formValue.groupOrganizationName,
        companyRelationType: formValue.companyRelationType
      })
    };

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
