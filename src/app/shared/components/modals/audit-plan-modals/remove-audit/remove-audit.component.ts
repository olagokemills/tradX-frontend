import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-audit',
  templateUrl: './remove-audit.component.html',
  styleUrls: ['./remove-audit.component.scss']
})
export class RemoveAuditComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveAuditComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
