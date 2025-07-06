import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Column {
  name: string;
  visible: boolean;
}

@Component({
  selector: 'app-edit-columns-dialog',
  template: `
    <h2 mat-dialog-title>Edit Columns</h2>
    <mat-dialog-content>
      <div class="columns-list">
        <mat-checkbox
          *ngFor="let column of data.columns"
          [(ngModel)]="column.visible"
          class="column-item"
        >
          {{ column.name }}
        </mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .columns-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
    .column-item {
      margin-bottom: 0.5rem;
    }
  `]
})
export class EditColumnsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { columns: Column[] }
  ) { }

  onSave(): void {
    this.dialogRef.close(this.data.columns);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
