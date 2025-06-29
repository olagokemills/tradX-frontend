import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { PublicService } from 'src/app/core/utils/public.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss'],
})
export class AddPlanComponent {
  year: string = '';
  loading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddPlanComponent>,
    private api: AuditService,
    @Inject(MAT_DIALOG_DATA) public data: any // private pubs: PublicService // Assuming you have a generic service for API calls
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.year) {
      console.error('Year is required');
      return;
    }
    this.loading = true;
    const body = {
      year: this.year,
      organizationId: this.data.organizationId, // For testing purposes
    };
    this.api.createAuditYear(body).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        // this.pubs.toastr.success('Audit Year Created Successfully');
        this.dialogRef.close();
      },
      (error) => {
        console.error(error);
        // this.pubs.toastr.error('Failed to Create Audit Year');
      }
    );
  }
}
