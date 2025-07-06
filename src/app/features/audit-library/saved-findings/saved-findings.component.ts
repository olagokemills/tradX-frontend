import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Finding } from '../../../shared/models/finding.model';
import { EditColumnsDialogComponent } from '../../../shared/components/modals/edit-columns-dialog/edit-columns-dialog.component';
import { FilterDialogComponent } from '../../../shared/components/modals/filter-dialog/filter-dialog.component';
import { ViewFindingDialogComponent } from '../../../shared/components/modals/view-finding-dialog/view-finding-dialog.component';
import { EditFindingDialogComponent } from '../../../shared/components/modals/edit-finding-dialog/edit-finding-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-saved-findings',
  templateUrl: './saved-findings.component.html',
  styleUrls: ['./saved-findings.component.scss']
})
export class SavedFindingsComponent implements OnInit {
  findings: Finding[] = [];
  currentPage: number = 1;
  totalPages: number = 12;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Mock data for saved findings
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
        bookmarked: true
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
        bookmarked: true
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
          { name: 'Issue Owner', visible: true },
          { name: 'Management Action Plan', visible: true },
          { name: 'Type of Closure', visible: true },
          { name: 'Date Remediated', visible: true },
          { name: 'Rational for Closing Issue', visible: true },
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
    const fileName = `saved-findings-report-${new Date().toISOString().split('T')[0]}.xlsx`;
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
        title: 'Remove from Saved',
        message: 'Are you sure you want to remove this finding from saved items?',
        confirmText: 'Remove',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Remove finding from the list
        this.findings = this.findings.filter(f => f.id !== finding.id);
        this.snackBar.open('Finding removed from saved items', 'Close', {
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
}
