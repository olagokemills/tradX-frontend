import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { AddPlanComponent } from 'src/app/shared/components/modals/audit-plan-modals/add-plan/add-plan.component';
import { RemoveAuditComponent } from 'src/app/shared/components/modals/audit-plan-modals/remove-audit/remove-audit.component';
import { UpdateStatusComponent } from 'src/app/shared/components/modals/audit-plan-modals/update-status/update-status.component';

@Component({
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss'],
})
export class AuditPlanComponent implements OnInit {
  dialog = inject(MatDialog);
  OrgId: string = '';
  Actions = [
    { label: 'Delete 2022 Audit Plan', value: 'delete' },
    { label: 'Add New Audit Plan', value: 'add' },
  ];
  auditYearList: Array<any> = [];
  selectedAuditYear: { yearName: string; yearId: string } | null = null;
  auditData = [];
  currentYearAudit = []
selectedItem:any;
  constructor(private api: AuditService, private helper: EncryptionService) {}
  ngOnInit(): void {
    this.GetDetails();
    this.fetchAuditYear();
    this.fetchYearRelatedAudits();
  }

  handleActionClick(action: any) {
    if (action === 'delete') {
      this.viewAudit();
    } else if (action === 'add') {
      this.addplan();
    }
  }

  GetDetails() {
    const details = this.helper.GetItem('user').data;
    this.OrgId = details?.user.organizationId;
  }
  addplan() {
    const dialogRef = this.dialog.open(AddPlanComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  viewAudit() {}
  removeAudit() {
    const dialogRef = this.dialog.open(RemoveAuditComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  updateAudit() {
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  fetchAuditPlans(yearId: string) {
    this.api.FetchAuditPlans(yearId, this.OrgId).subscribe((res) => {
      this.auditData = res.data;
    });
  }
  fetchAuditYear() {
    this.api.GetAudityear().subscribe((res) => {
      console.log(res);
      this.auditYearList = res.data;
      if (res.data.length >= 1) {
        this.selectedAuditYear = {
          yearId: res.data[0].yearId,
          yearName: `${res.data[0].yearName}`,
        };
        this.fetchAuditPlans(res.data[0].yearId);
      }
    });
  }
  handleYearClick(data: any) {
    this.selectedAuditYear = {
      yearId: data,
      yearName: `Year ${data}`,
    };
    this.fetchAuditPlans(data);
  }
  returnMappedValues(data: Array<any>) {
    if (data.length) {
      return [
        ...data.map((item) => {
          return {
            label: item.yearName,
            value: item.yearId,
          };
        }),
      ];
    }
    return [];
  }
  fetchYearRelatedAudits() {
    this.api.FetchCurrentYearAudit(this.OrgId).subscribe((res) => {
      if (res.isSuccess) {
      this.currentYearAudit = res.data
    }
    });
  }
  selectAuditItem(data:any){
    this.selectedItem = data
    console.log(data, 'got vsllrf? d')
  }
}
