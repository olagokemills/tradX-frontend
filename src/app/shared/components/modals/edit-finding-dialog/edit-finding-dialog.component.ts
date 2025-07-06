import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Finding } from '../../../models/finding.model';

@Component({
  selector: 'app-edit-finding-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.finding ? 'Edit' : 'Add' }} Finding</h2>
    <form [formGroup]="findingForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category" required>
              <mat-option value="Operational">Operational</mat-option>
              <mat-option value="Strategic">Strategic</mat-option>
              <mat-option value="Financial">Financial</mat-option>
              <mat-option value="Compliance">Compliance</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority" required>
              <mat-option value="Major">Major</mat-option>
              <mat-option value="Minor">Minor</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="Open">Open</mat-option>
              <mat-option value="Closed">Closed</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Closure Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="closureDate" required>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" required rows="4"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Recommendation</mat-label>
            <textarea matInput formControlName="recommendation" required rows="4"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-button color="primary" type="submit" [disabled]="!findingForm.valid">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class EditFindingDialogComponent {
  findingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditFindingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { finding: Finding }
  ) {
    this.findingForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      closureDate: ['', Validators.required],
      description: ['', Validators.required],
      recommendation: ['', Validators.required]
    });

    if (data.finding) {
      this.findingForm.patchValue(data.finding);
    }
  }

  onSubmit() {
    if (this.findingForm.valid) {
      this.dialogRef.close(this.findingForm.value);
    }
  }
}
