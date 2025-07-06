import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RemoveAuditComponent } from '../remove-audit/remove-audit.component';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss'],
})
export class UpdateStatusComponent {
  status: string = '';
  loading: boolean = false;
  pageName: string = 'Update Audit';
  constructor(
    public dialogRef: MatDialogRef<UpdateStatusComponent>,
    private api: AuditService,
    private gVars: GenericService,
    @Inject(MAT_DIALOG_DATA)
    public data: { auditId: string; action: string; organizationId?: string }
  ) {
    this.pageName = this.data.action || 'Update Audit';
    console.log(data, 'data from update status modal');
  }

  onClose() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.loading = true;
    this.api
      .UpdateAuditStatus({
        status: this.status,
        auditPlanId: this.data.auditId,
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.isSuccess) {
            this.gVars.toastr.success('Audit status updated successfully.');
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.loading = false;
          this.gVars.toastr.error(
            'Error updating audit status. Please try again later.'
          );
          console.error(err);
        },
      });
  }

  onFreezeAudit() {
    this.loading = true;
    this.api
      .FreezeAudit({
        auditPlanId: this.data.auditId,
        organizationId: this.data.organizationId ?? '',
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.isSuccess) {
            this.gVars.toastr.success('Audit frozen successfully.');
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.loading = false;
          this.gVars.toastr.error(
            'Error freezing audit. Please try again later.'
          );
          console.error(err);
        },
      });
  }
}
