import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuditService } from 'src/app/core/services/audit/audit-services.service';
import { EncryptionService } from 'src/app/core/utils/encryption.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { AddAuditComponent } from 'src/app/shared/components/modals/audit-plan-modals/add-audit/add-audit.component';
import { AddPlanComponent } from 'src/app/shared/components/modals/audit-plan-modals/add-plan/add-plan.component';
import { EditAuditComponent } from 'src/app/shared/components/modals/audit-plan-modals/edit-audit/edit-audit.component';
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
  Actions = [{ label: 'Add New Audit Plan', value: 'add' }];
  auditYearList: Array<any> = [];
  selectedAuditYear: { yearName: string; yearId: string } | null = null;
  auditData = [];
  currentYearAudit = [];
  selectedItem: any;
  removedAudits: Array<any> = [];
  constructor(
    private api: AuditService,
    private helper: EncryptionService,
    private gVars: GenericService
  ) {}
  ngOnInit(): void {
    this.GetDetails();
    this.getAuditYearList();
    this.fetchCurrentYearAudit();
    this.fetchRemovedAudits();
  }

  handleActionClick(action: any) {
    if (action === 'delete') {
      this.viewAudit();
    } else if (action === 'add') {
      this.addplan();
    }
  }

  getAuditYearList() {
    this.api.FetchAuditYearList(this.OrgId).subscribe((res) => {
      this.auditYearList = res.data;
      if (res.data.length > 0) {
        this.selectedAuditYear = {
          yearId: res.data[0].yearId,
          yearName: `Year ${res.data[0].yearId}`,
        };
        this.fetchAuditPlans(res.data[0].yearId);
        // this.fetchYearRelatedAudits();
      }
    });
  }

  GetDetails() {
    const Org = JSON.parse(sessionStorage.getItem('organizationInfo')!);
    this.OrgId = Org?.data.organizations[0].companyId;
  }
  addplan() {
    const dialogRef = this.dialog.open(AddPlanComponent, {
      width: '500px',
      data: {
        organizationId: this.OrgId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }
  modifyTiming(item: string) {
    const dialogRef = this.dialog.open(EditAuditComponent, {
      width: '500px',
      data: {
        auditId: item,
        action: 'Modify Timing',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }
  viewAudit() {}
  removeAudit(data: any) {
    const dialogRef = this.dialog.open(RemoveAuditComponent, {
      width: '500px',
      data: {
        auditId: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }
  updateAudit(data: string) {
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '500px',
      data: {
        auditId: data,
        action: 'Update Audit',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }

  freezeAudit(auditId: string) {
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '500px',
      data: {
        auditId: auditId,
        action: 'Freeze Audit',
        organizationId: this.OrgId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }

  fetchAuditPlans(yearId: string) {
    this.api.FetchAuditPlans(yearId, this.OrgId).subscribe((res) => {
      this.auditData = res.data;
    });
  }

  handleYearClick(data: any) {
    this.gVars.toastr.info(`Fetching Audit Plans for Year ${data}`, 'Info');
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
            label: `Year ${item.yearId}`,
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
        this.auditYearList = res.data;
        // this.auditYearList = res.data;
        // if (res.data.length > 1) {
        //   this.selectedAuditYear = {
        //     yearId: res.data[0].yearId,
        //     yearName: `${res.data[0].yearId}`,
        //   };
        //   this.fetchAuditPlans(res.data[0].yearId);
        // }
      }
    });
  }
  selectAuditItem(data: any) {
    this.selectedItem = data;
  }

  openAddAuditModal() {
    const dialogRef = this.dialog.open(AddAuditComponent, {
      width: '500px',
      data: {
        auditYear: this.selectedAuditYear?.yearId,
        organizationId: this.OrgId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }
  editAuditPlan(audit: any) {
    const dialogRef = this.dialog.open(AddAuditComponent, {
      width: '500px',
      data: {
        audit,
        auditYear: this.selectedAuditYear?.yearId,
        organizationId: this.OrgId,
        mode: 'edit',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchPageData();
    });
  }

  fetchPageData() {
    this.getAuditYearList();
    setTimeout(() => {
      this.fetchAuditPlans(this.selectedAuditYear?.yearId || '');
    }, 900);
  }

  fetchCurrentYearAudit() {
    this.api.FetchCurrentYearAudit(this.OrgId).subscribe((res) => {
      if (res.isSuccess) {
        this.currentYearAudit = res.data;
      } else {
        this.gVars.toastr.error('Failed to fetch current year audits.');
      }
    });
  }
  fetchRemovedAudits() {
    this.api.FetchRemovedAudits(this.OrgId).subscribe((res) => {
      if (res.isSuccess) {
        this.removedAudits = res.data;
      } else {
        this.gVars.toastr.error('Failed to fetch removed audits.');
      }
    });
  }
}
