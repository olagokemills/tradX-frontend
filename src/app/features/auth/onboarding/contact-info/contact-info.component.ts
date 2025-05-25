import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() ContactInfo: any | null = null;
  ContactForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.populateForm();
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
      role: [
        this.ContactInfo?.role || '',
        [Validators.minLength(6), Validators.required],
      ],
    });
    // if (this.ContactInfo) {
    //   this.ContactForm.patchValue({
    //     businessName: this.ContactInfo?.businessName || '',
    //     businessType: this.ContactInfo?.businessType || '',
    //     businessAddress: this.ContactInfo?.businessAddress || '',
    //     businessPhone: this.ContactInfo?.businessPhone || '',
    //   });
    // }
  }
  handleSubmit(data: any) {
    this.formSubmit.emit(this.ContactInfo);
  }
}
