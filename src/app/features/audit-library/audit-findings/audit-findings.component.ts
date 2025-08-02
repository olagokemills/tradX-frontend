import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/components/modals/confirm-dialog/confirm-dialog.component';
import { EditColumnsDialogComponent } from 'src/app/shared/components/modals/edit-columns-dialog/edit-columns-dialog.component';
import { EditFindingDialogComponent } from 'src/app/shared/components/modals/edit-finding-dialog/edit-finding-dialog.component';
import { FilterDialogComponent } from 'src/app/shared/components/modals/filter-dialog/filter-dialog.component';
import { ViewFindingDialogComponent } from 'src/app/shared/components/modals/view-finding-dialog/view-finding-dialog.component';
import { Finding } from 'src/app/shared/models/finding.model';


@Component({
  selector: 'app-audit-findings',
  templateUrl: './audit-findings.component.html',
  styleUrls: ['./audit-findings.component.scss']
})
export class AuditFindingsComponent implements OnInit {
  findings: Finding[] = [];
  currentPage: number = 1;
  totalPages: number = 12;
  showAddFindingModal = false;
  isLoadingFindings: boolean = false;
  onAddFinding(finding: any) {
    // Add the new finding to the findings list (mock implementation)
    this.findings = [
      {
        id: finding.sn,
        closureDate: finding.closureDate,
        priority: finding.priority,
        title: finding.title,
        category: finding.category,
        description: finding.description,
        recommendation: finding.recommendation,
        status: 'Open',
        issueOwner: finding.issueOwner,
        managementActionPlan: finding.managementActionPlan,
        typeOfClosure: '',
        dateRemediated: undefined,
        rationalForClosingIssue: '',
        bookmarked: false
      },
      ...this.findings
    ];
    this.showAddFindingModal = false;
  }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Mock data to match the screenshot
    this.findings = [
      {
        id: '97174',
        closureDate: new Date('2021-12-22'),
        priority: 'Major',
        title: 'Sharply Africa, Sharply',
        category: 'Operational',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Open',
        issueOwner: 'John Doe',
        managementActionPlan: 'Implement new security protocols and conduct quarterly reviews',
        typeOfClosure: 'Full Remediation',
        dateRemediated: new Date('2022-01-15'),
        rationalForClosingIssue: 'All security measures have been implemented and verified',
        bookmarked: true
      },
      {
        id: '39635',
        closureDate: new Date('2022-03-25'),
        priority: 'Major',
        title: 'Sharply Nigeria,Sharply Africa',
        category: 'Strategic',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'Jane Smith',
        managementActionPlan: 'Update strategic planning framework and conduct staff training',
        typeOfClosure: 'Partial Remediation',
        dateRemediated: new Date('2022-04-10'),
        rationalForClosingIssue: 'Significant improvements made, risk reduced to acceptable level',
        bookmarked: false
      },
      {
        id: '43178',
        closureDate: new Date('2022-03-18'),
        priority: 'Minor',
        title: 'Sharply, Sharply Africa',
        category: 'Information Technology',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'Mike Johnson',
        managementActionPlan: 'Upgrade IT infrastructure and implement monitoring systems',
        typeOfClosure: 'Full Remediation',
        dateRemediated: new Date('2022-04-20'),
        rationalForClosingIssue: 'All IT systems upgraded and functioning properly',
        bookmarked: false
      },
      {
        id: '70668',
        closureDate: new Date('2022-02-12'),
        priority: 'Minor',
        title: 'Sharply',
        category: 'Compliance',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'Sarah Wilson',
        managementActionPlan: 'Review compliance procedures and update documentation',
        typeOfClosure: 'Management Override',
        dateRemediated: new Date('2022-03-05'),
        rationalForClosingIssue: 'Management decision based on cost-benefit analysis',
        bookmarked: false
      },
      {
        id: '22739',
        closureDate: new Date('2021-07-01'),
        priority: 'Minor',
        title: 'Sharply Africa',
        category: 'Regulatory',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'David Brown',
        managementActionPlan: 'Engage with regulatory bodies and update compliance framework',
        typeOfClosure: 'Full Remediation',
        dateRemediated: new Date('2021-08-15'),
        rationalForClosingIssue: 'Regulatory requirements fully met and documented',
        bookmarked: false
      },
      {
        id: '43756',
        closureDate: new Date('2022-06-08'),
        priority: 'Major',
        title: 'Sharply Africa',
        category: 'Financial',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'Lisa Anderson',
        managementActionPlan: 'Implement financial controls and conduct monthly reconciliations',
        typeOfClosure: 'Full Remediation',
        dateRemediated: new Date('2022-07-20'),
        rationalForClosingIssue: 'Financial controls implemented and tested successfully',
        bookmarked: false
      },
      {
        id: '97174',
        closureDate: new Date('2021-11-28'),
        priority: 'Minor',
        title: 'Sharply Nigeria',
        category: 'Information Technology',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'Robert Taylor',
        managementActionPlan: 'Deploy security patches and update access controls',
        typeOfClosure: 'Full Remediation',
        dateRemediated: new Date('2021-12-30'),
        rationalForClosingIssue: 'All security vulnerabilities addressed and patched',
        bookmarked: false
      },
      {
        id: '22739',
        closureDate: new Date('2022-05-12'),
        priority: 'Major',
        title: 'Sharply Africa',
        category: 'Operational',
        description: 'it is a long established fact that a reader will be distracted by the read ...',
        recommendation: 'it is a long established fact that a reader will be distracted by the read ...',
        status: 'Closed',
        issueOwner: 'Emily Davis',
        managementActionPlan: 'Redesign operational processes and provide staff training',
        typeOfClosure: 'Partial Remediation',
        dateRemediated: new Date('2022-06-25'),
        rationalForClosingIssue: 'Process improvements implemented, ongoing monitoring in place',
        bookmarked: false
      }
    ];
  }

  editColumns() {
    this.dialog.open(EditColumnsDialogComponent, {
      width: '600px',
      data: {
        columns: [
          { name: 'SN', visible: true },
          { name: 'Agreed Closure Date', visible: true },
          { name: 'Priority Level', visible: true },
          { name: 'Finding Title', visible: true },
          { name: 'Finding Category', visible: true },
          { name: 'Description Of Audit Observation', visible: true },
          { name: 'Recommendation', visible: true },
          { name: 'Status', visible: true }
        ]
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Update visible columns
        console.log('Columns updated:', result);
      }
    });
  }

  openFilter() {
    this.dialog.open(FilterDialogComponent, {
      width: '600px',
      data: {
        filters: {
          priority: ['Major', 'Minor'],
          status: ['Open', 'Closed'],
          category: ['Operational', 'Strategic', 'Financial', 'Compliance'],
          dateRange: { start: null, end: null }
        }
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Apply filters
        console.log('Filters applied:', result);
        this.applyFilters(result);
      }
    });
  }

  private applyFilters(filters: any) {
    let filtered = [...this.findings];

    if (filters.priority?.length) {
      filtered = filtered.filter(f => filters.priority.includes(f.priority));
    }

    if (filters.status?.length) {
      filtered = filtered.filter(f => filters.status.includes(f.status));
    }

    if (filters.category?.length) {
      filtered = filtered.filter(f => filters.category.includes(f.category));
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      filtered = filtered.filter(f => {
        const date = new Date(f.closureDate);
        return date >= start && date <= end;
      });
    }

    this.findings = filtered;
  }

  downloadReport() {
    // In a real implementation, this would call a service method
    const fileName = `audit-findings-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    this.snackBar.open(`Downloading ${fileName}...`, 'Close', {
      duration: 3000
    });
  }

  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.findings = this.findings.map(f => ({ ...f, selected: checked }));
  }

  toggleBookmark(finding: Finding) {
    finding.bookmarked = !finding.bookmarked;
    const action = finding.bookmarked ? 'added to' : 'removed from';
    this.snackBar.open(`Finding ${action} bookmarks`, 'Close', {
      duration: 2000
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  viewDetails(finding: Finding) {
    this.dialog.open(ViewFindingDialogComponent, {
      width: '800px',
      data: { finding }
    });
  }

  editFinding(finding: Finding) {
    this.dialog.open(EditFindingDialogComponent, {
      width: '800px',
      data: { finding }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Update finding in the list
        const index = this.findings.findIndex(f => f.id === finding.id);
        if (index !== -1) {
          this.findings[index] = { ...finding, ...result };
          this.snackBar.open('Finding updated successfully', 'Close', {
            duration: 3000
          });
        }
      }
    });
  }

  deleteFinding(finding: Finding) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Finding',
        message: 'Are you sure you want to delete this finding?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Remove finding from the list
        this.findings = this.findings.filter(f => f.id !== finding.id);
        this.snackBar.open('Finding deleted successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onSearchChange(searchTerm: string) {
    // In a real implementation, this would typically be debounced
    // and would call a service method
    console.log('Searching for:', searchTerm);
    // Filter findings locally for now
    if (!searchTerm.trim()) {
      // Reset to original data
      this.ngOnInit();
      return;
    }

    const term = searchTerm.toLowerCase();
    this.findings = this.findings.filter(finding =>
      finding.title.toLowerCase().includes(term) ||
      finding.category.toLowerCase().includes(term) ||
      finding.description.toLowerCase().includes(term) ||
      finding.recommendation.toLowerCase().includes(term)
    );
  }

  bookmark(finding: Finding) {
    finding.bookmarked = !finding.bookmarked;
  }
}
