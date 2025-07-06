import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-report-form',
  templateUrl: './add-report-form.component.html',
  styleUrls: ['./add-report-form.component.scss']
})
export class AddReportFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  reportForm: FormGroup;
  loading = false;

  // Mock data for dropdowns
  entities = ['Nigeria', 'Ghana', 'Kenya', 'South Africa'];
  ratings = ['Strong', 'Weak'];
  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  auditNames = ['Internal Audit', 'External Audit', 'Compliance Audit'];

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reportNumber: ['', Validators.required],
      reportDate: ['', Validators.required],
      entity: ['', Validators.required],
      overallRating: ['', Validators.required],
      otherUniqueIdentifier: [''],
      quarter: ['', Validators.required],
      auditName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.loading = true;
      this.submit.emit(this.reportForm.value);
      // Simulate API call completion
      setTimeout(() => {
        this.loading = false;
        this.close.emit();
      }, 1000);
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
