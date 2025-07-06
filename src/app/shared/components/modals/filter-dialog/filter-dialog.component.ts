import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

interface FilterDialogData {
  filters: {
    priority: string[];
    status: string[];
    category: string[];
    dateRange: { start: Date | null; end: Date | null; };
  };
}

@Component({
  selector: 'app-filter-dialog',
  template: `
    <h2 mat-dialog-title>Filter Findings</h2>
    <mat-dialog-content>
      <form [formGroup]="filterForm" class="filter-form">
        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority" multiple>
            <mat-option *ngFor="let p of data.filters.priority" [value]="p">
              {{p}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" multiple>
            <mat-option *ngFor="let s of data.filters.status" [value]="s">
              {{s}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category" multiple>
            <mat-option *ngFor="let c of data.filters.category" [value]="c">
              {{c}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date Range</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input matStartDate formControlName="startDate" placeholder="Start date">
            <input matEndDate formControlName="endDate" placeholder="End date">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClear()">Clear</button>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onApply()">Apply</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .filter-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
  `]
})
export class FilterDialogComponent {
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData
  ) {
    this.filterForm = this.fb.group({
      priority: [[]],
      status: [[]],
      category: [[]],
      startDate: [null],
      endDate: [null]
    });
  }

  onClear(): void {
    this.filterForm.reset();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close(this.filterForm.value);
  }
}
