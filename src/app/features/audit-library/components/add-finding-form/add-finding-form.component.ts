import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-finding-form',
  templateUrl: './add-finding-form.component.html',
  styleUrls: ['./add-finding-form.component.scss']
})
export class AddFindingFormComponent {
  @Output() submit = new EventEmitter<any>();
  findingForm: FormGroup;
  loading = false;

  priorityOptions = ['High', 'Medium', 'Low'];
  categoryOptions = ['Operational', 'Strategic', 'Financial', 'Compliance'];
  reminderOptions = ['1 day before', '2 days before', '1 week before'];
  userOptions = ['All', 'Owner', 'Manager'];

  constructor(private fb: FormBuilder) {
    this.findingForm = this.fb.group({
      sn: ['', Validators.required],
      closureDate: ['', Validators.required],
      priority: ['', Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      recommendation: ['', Validators.required],
      issueOwner: ['', Validators.required],
      managementActionPlan: ['', Validators.required],
      reminder: ['', Validators.required],
      user: ['', Validators.required],
      addNotification: [false]
    });
  }

  onSubmit() {
    if (this.findingForm.valid) {
      this.loading = true;
      this.submit.emit(this.findingForm.value);
      // Simulate loading
      setTimeout(() => this.loading = false, 1000);
    }
  }
}
