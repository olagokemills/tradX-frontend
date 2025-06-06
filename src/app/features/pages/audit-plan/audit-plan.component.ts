import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RemoveAuditComponent } from 'src/app/shared/components/modals/audit-plan-modals/remove-audit/remove-audit.component';

@Component({
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss'],
})
export class AuditPlanComponent {
    dialog = inject(MatDialog);
  Actions = [
    { label: 'Delete 2022 Audit Plan', value: 'delete' },
    { label: 'Add New Audit Plan', value: 'add' },
  ];
  Years = [
    { label: 'Year 2022', value: '2022' },
    { label: 'Year 2023', value: '2023' },
    { label: 'Year 2024', value: '2024' },
  ];
  auditData = [
    {
      department: 'Finance',
      title: 'Reconciliation',
      proposedTiming: '25 March',
      changesToPT: 'N/A',
      status: 'Planning',
    },
    {
      department: 'HR',
      title: 'Pay roll',
      proposedTiming: '18 August',
      changesToPT: 'N/A',
      status: 'Fieldwork',
    },
    {
      department: 'Admin',
      title: 'Property Management',
      proposedTiming: '18 August',
      changesToPT: 'N/A',
      status: 'Not started',
    },
    {
      department: 'Finance',
      title: 'Fleet Management',
      proposedTiming: '12 February',
      changesToPT: '20 May',
      status: 'Not started',
    },
    {
      department: 'HR',
      title: 'Fixed Asset Management',
      proposedTiming: '01 July',
      changesToPT: 'N/A',
      status: 'Not started',
    },
    {
      department: 'Finance',
      title: 'Bank Reconciliation',
      proposedTiming: '08 June',
      changesToPT: 'N/A',
      status: 'Not started',
    },
    {
      department: 'HR',
      title: 'Pay roll',
      proposedTiming: '28 November',
      changesToPT: 'N/A',
      status: 'Planning',
    },
    {
      department: 'Admin',
      title: 'Property Management',
      proposedTiming: '12 May',
      changesToPT: '1 June',
      status: 'Not started',
    },
  ];

  handleActionClick(action: any) {
    alert(`you clicked: ${action}`);
    console.log('you licked: ', action);
  }
  viewAudit() { }
    removeAudit() {
      const dialogRef = this.dialog.open(RemoveAuditComponent, {
        width: '500px',
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
}
