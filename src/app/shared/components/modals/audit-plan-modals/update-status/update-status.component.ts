import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RemoveAuditComponent } from '../remove-audit/remove-audit.component';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent {
 constructor(
    public dialogRef: MatDialogRef<UpdateStatusComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
