import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating-info',
  templateUrl: './rating-info.component.html',
  styleUrls: ['./rating-info.component.scss'],
})
export class RatingInfoComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() RatingInfo: any | null = null;
  RatingForm!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.populateForm();
  }

  populateForm() {
    this.RatingForm = this.fb.group({
      fullName: [
        this.RatingInfo?.fullName || '',
        [Validators.minLength(6), Validators.required],
      ],
      emailAddress: [
        this.RatingInfo?.emailAddress || '',
        [Validators.minLength(6), Validators.required],
      ],
      phoneNumber: [
        this.RatingInfo?.phoneNumber || '',
        [Validators.minLength(6), Validators.required],
      ],
      role: [
        this.RatingInfo?.role || '',
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
    this.formSubmit.emit(this.RatingInfo);
  }
}
