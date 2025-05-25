import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss'],
})
export class OrganizationDetailsComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() OrganizationDetails: any | null = null;
  OrganizationForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm() {
    this.OrganizationForm = this.fb.group({
      companyName: [
        this.OrganizationDetails?.companyName || '',
        [Validators.minLength(6), Validators.required],
      ],
      psuedoName: [
        this.OrganizationDetails?.psuedoName || '',
        [Validators.minLength(6), Validators.required],
      ],
      primaryDomain: [
        this.OrganizationDetails?.primaryDomain || '',
        [Validators.minLength(6), Validators.required],
      ],
      country: [
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
  handleSubmit(data: any) {
    this.formSubmit.emit(this.OrganizationDetails);
  }
}
