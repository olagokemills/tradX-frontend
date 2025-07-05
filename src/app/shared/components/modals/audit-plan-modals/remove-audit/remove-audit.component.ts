import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';

@Component({
  selector: 'app-remove-audit',
  templateUrl: './remove-audit.component.html',
  styleUrls: ['./remove-audit.component.scss'],
})
export class RemoveAuditComponent {
  loading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<RemoveAuditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { auditId: string },
    private api: AuditService
  ) {}

  onClose() {
    this.dialogRef.close();
  }
  GetDetails() {
    const Org = JSON.parse(sessionStorage.getItem('organizationInfo')!);
    return Org?.data.organizations[0].companyId;
  }
  onConfirm() {
    console.log(this.data);
    const body = {
      auditId: this.data.auditId,
      organizationId: this.GetDetails(),
    };
    console.log(body);
    this.loading = true;
    // Logic to remove the audit using data.auditId
    this.api.removeAudit(body).subscribe(
      (response) => {
        this.loading = false;
        console.log('Audit removed successfully:', response);
        this.dialogRef.close(true); // Close dialog and return true to indicate success
      },
      (error) => {
        console.error('Error removing audit:', error);
        this.dialogRef.close(false); // Close dialog and return false to indicate failure
      }
    );
    console.log('Audit removed with ID:', this.data.auditId);
    this.dialogRef.close(true); // Close dialog and return true to indicate success
  }
}
