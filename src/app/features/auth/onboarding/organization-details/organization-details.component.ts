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
  toppingList: Array<any> = [];
  OrgId: string = '';

  numberOfEmployees: string[] = ['1 - 50', '50 - 100', '101 - 200'];
  annualTurnOver: string[] = ['50m', '100m', '200m'];
  industry: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private helper: EncryptionService,
    private api: LoginService
  ) {}

  ngOnInit(): void {
    this.populateForm();
    this.GetCountries();
    this.GetExchanges();
    this.GetIndustries();
    console.log(this.helper.GetItem('user'));
    this.GetDetails();
  }

  populateForm() {
    this.OrganizationForm = this.fb.group({
      companyName: [
        this.OrganizationDetails?.companyName || '',
        [Validators.minLength(6), Validators.required],
      ],
      exchangeList: [],
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
      exchangeListed: [],
      companyId: this.OrgId,
      numberOfEmployees: [''],
      annualTurnOver: [''],
      groupMember: [false],
      individualCompany: [true],
      industry: [],
    });
    if (this.OrganizationDetails) {
      this.OrganizationForm.patchValue({
        businessName: this.OrganizationDetails?.businessName || '',
        businessType: this.OrganizationDetails?.businessType || '',
        businessAddress: this.OrganizationDetails?.businessAddress || '',
        businessPhone: this.OrganizationDetails?.businessPhone || '',
      });
    }
  }

  get orgForm() {
    return this.OrganizationForm?.controls;
  }
  GetDetails() {
    const details = this.helper.GetItem('user').data;
    this.OrgId = details?.user.organizationId;
  }
  handleSubmit(data: any) {
    const body = {
      ...this.OrganizationForm.value,
      countryId: Number(this.OrganizationForm.value.countryId),
      companyId: this.OrgId,
      groupOrganizationName: '',
    };
    this.api.SaveCompanyOnboardingInfo(body).subscribe((res) => {
      console.log(res);
      if (res.isSuccess) {
        this.formSubmit.emit('success');
      } else {
      }
    });
    this.formSubmit.emit(body);
  }

  GetCountries() {
    this.api.GetCountries().subscribe((res) => {
      this.Countries = res.data;
    });
  }
  GetExchanges() {
    this.api.GetExchanges().subscribe((res) => {
      this.toppingList = res.data;
    });
  }

  GetIndustries() {
    this.api.GetIndustries().subscribe((res) => {
      this.industry = res.data;
    });
  }
}
