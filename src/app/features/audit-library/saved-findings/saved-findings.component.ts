import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Finding } from '../../../shared/models/finding.model';
import { EditColumnsDialogComponent } from '../../../shared/components/modals/edit-columns-dialog/edit-columns-dialog.component';
import { FilterDialogComponent } from '../../../shared/components/modals/filter-dialog/filter-dialog.component';
import { ViewFindingDialogComponent } from '../../../shared/components/modals/view-finding-dialog/view-finding-dialog.component';
import { EditFindingDialogComponent } from '../../../shared/components/modals/edit-finding-dialog/edit-finding-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/modals/confirm-dialog/confirm-dialog.component';
import { AuditFindingsService } from '../../../core/services/audit/audit-findings.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-saved-findings',
  templateUrl: './saved-findings.component.html',
  styleUrls: ['./saved-findings.component.scss']
})
export class SavedFindingsComponent implements OnInit, OnDestroy {
  findings: Finding[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalCount: number = 0;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  isLoading: boolean = false;
  searchTerm: string = '';


  // Search functionality
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auditFindingsService: AuditFindingsService
  ) { }

  ngOnInit(): void {
    // Setup search debounce
    this.setupSearchDebounce();

    // Load saved findings
    this.loadSavedFindings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.currentPage = 1;
        this.loadSavedFindings();
      });
  }

  private loadSavedFindings(): void {
    this.isLoading = true;
    const orgId = localStorage.getItem('organizationId') as string;
    const params = {
      organizationId: orgId,
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      searchQuery: this.searchTerm || undefined
    };

    this.auditFindingsService.GetSavedFindings(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.findings = this.mapSavedFindingsToFindings(response.data);
            this.totalCount = response.totalCount || 0;
            this.totalPages = response.totalPages || 1;
            this.hasNextPage = response.hasNextPage || false;
            this.hasPreviousPage = response.hasPreviousPage || false;
          } else {
            console.error('Error loading saved findings:', response.errorMessage);
            this.snackBar.open('Failed to load saved findings', 'Close', {
              duration: 3000
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading saved findings:', error);
          this.snackBar.open('Failed to load saved findings', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }

  private mapSavedFindingsToFindings(savedFindings: any[]): Finding[] {
    return savedFindings.map((savedFinding: any) => ({
      id: savedFinding.serialNumber || savedFinding.id,
      closureDate: savedFinding.agreedClosureDate ? new Date(savedFinding.agreedClosureDate) : new Date(),
      priority: savedFinding.priorityLevel || 'Medium',
      title: savedFinding.findingTitle || '',
      category: savedFinding.findingCategory || '',
      description: savedFinding.auditObservation || '',
      recommendation: savedFinding.recommendation || '',
      status: savedFinding.status || 'Open',
      issueOwner: savedFinding.issueOwner || '',
      managementActionPlan: savedFinding.managementActionPlan || '',
      typeOfClosure: savedFinding.closureType || '',
      dateRemediated: savedFinding.dateRemediated ? new Date(savedFinding.dateRemediated) : undefined,
      rationalForClosingIssue: savedFinding.closureComment || '',
      bookmarked: true // Since these are saved findings
    }));
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
    if (this.currentPage > 1 && !this.isLoading) {
      this.currentPage--;
      this.loadSavedFindings();
    }
  }

  nextPage() {
    if (this.hasNextPage && !this.isLoading) {
      this.currentPage++;
      this.loadSavedFindings();
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
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }
}
