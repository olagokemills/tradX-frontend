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
  toppingList: string[] = [
    'NYSE',
    'NASDAQ',
    'Tokyo Stock Exchange',
    'Shanghai Stock Exchange',
    'Hong Kong Stock Exchange',
    'London Stock Exchange',
    'Euronext',
    'Shenzhen Stock Exchange',
  ];

  numberOfEmployees: string[] = ['1 - 50', '50 - 100', '101 - 200'];
  annualTurnOver: string[] = ['50m', '100m', '200m'];
  industry: string[] = ['Banking', 'Agriculture'];
  constructor(
    private fb: FormBuilder,
    private helper: EncryptionService,
    private api: LoginService
  ) {}

  ngOnInit(): void {
    this.populateForm();
    this.GetCountries();
    console.log(this.helper.GetItem('user'));
  }

  populateForm() {
    this.OrganizationForm = this.fb.group({
      companyName: [
        this.OrganizationDetails?.companyName || '',
        [Validators.minLength(6), Validators.required],
      ],
      exchangeName: [],
      psuedoName: [
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
      companyAddress: [
        this.OrganizationDetails?.companyAddress || '',
        [Validators.minLength(6), Validators.required],
      ],
      postCode: [
        this.OrganizationDetails?.postCode || '',
        [Validators.minLength(6), Validators.required],
      ],
      exchangeListed: [],
      numberOfEmployees: [''],
      annualTurnOver: [''],
      groupMember: [true],
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
  handleSubmit(data: any) {
    const body = {
      ...this.OrganizationForm.value,
      countryId: Number(this.OrganizationForm.value.countryId),
      exchangeName: this.OrganizationForm.value.exchangeName.join(', '),
    };
    this.formSubmit.emit(body);
  }

  GetCountries() {
    this.api.GetCountries().subscribe((res) => {
      this.Countries = res.data;
    });
  }
}
