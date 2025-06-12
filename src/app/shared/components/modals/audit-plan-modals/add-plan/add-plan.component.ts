import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent {
 constructor(
    public dialogRef: MatDialogRef<AddPlanComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
