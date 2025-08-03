import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuditLibraryService } from 'src/app/core/services/audit/audit-library.service';
import { AuditReport, AuditReportResponse } from 'src/app/shared/models/audit-report.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/modals/confirm-dialog/confirm-dialog.component';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-audit-report-library',
  templateUrl: './audit-report-library.component.html',
  styleUrls: ['./audit-report-library.component.scss']
})
export class AuditReportLibraryComponent implements OnInit, OnDestroy {
  reports: AuditReport[] = [];
  filteredReports: AuditReport[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  totalCount: number = 0;
  itemsPerPage: number = 10;
  isLoadingReports: boolean = false;

  // Search functionality
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Server-side pagination data
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  // Rating color map based on the provided data
  ratingColorMap: Record<string, string> = {
    'Unsatisfactory': '#dc3545',
    'Weak': '#fd7e14',
    'Needs Improvement': '#ffc107',
    'Satisfactory': '#20c997',
    'Strong': '#28a745',
    'Exemplary': '#007bff'
  };

  constructor(
    private auditLibraryService: AuditLibraryService,
    private dialog: MatDialog,
    private router: Router,
    private utils: GenericService
  ) { }

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500), // Wait 500ms after user stops typing
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1; // Reset to first page when searching
      this.loadReports();
    });
  }

  private loadReports(): void {
    this.isLoadingReports = true;
    const orgId = localStorage.getItem('organizationId') as string;

    const params = {
      organizationId: orgId,
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      ...(this.searchTerm && { searchQuery: this.searchTerm })
    };

    this.auditLibraryService.GetAuditReports(params).subscribe({
      next: (res: AuditReportResponse) => {
        this.reports = res.data || [];
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.hasNextPage = res.hasNextPage;
        this.hasPreviousPage = res.hasPreviousPage;
        this.currentPage = res.pageNumber;
        this.itemsPerPage = res.pageSize;
        this.isLoadingReports = false;
      },
      error: (err) => {
        this.isLoadingReports = false;
        this.utils.toastr.error('Failed to load reports', 'Error');
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onReportRowClick(report: AuditReport): void {
    // Store the selected report data for the findings component to access
    sessionStorage.setItem('selectedAuditReport', JSON.stringify(report));

    // Navigate to findings page with the report ID
    this.router.navigate(['/audit-library/findings', report.auditReportId]);
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Reset to first page
    this.loadReports();
  }

  onFilter(): void {
    // For now, just reload data to show loading state
    // You can implement actual filter logic here later
    this.loadReports();
  }

  onDownloadReport(): void {
    // Implement download functionality
  }

  onAddReport(): void {
    // Implement add report functionality
  }

  onMoreOptions(report: AuditReport): void {
    // Implement more options functionality
  }

  onEditReport(report: AuditReport): void {
    this.isEditMode = true;
    this.selectedReportForEdit = report;
    this.showAddReportModal = true;
  }

  onFreezeReport(report: AuditReport): void {
    // Show confirmation dialog before freezing
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Freeze Report',
        message: `Are you sure you want to freeze report "${report.reportNumber}"? This will restrict viewing access to the report.`,
        confirmText: 'Freeze Report',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.freezeReportConfirmed(report);
      }
    });
  }

  private freezeReportConfirmed(report: AuditReport): void {
    const orgId = localStorage.getItem('organizationId') as string;

    if (!orgId) {
      this.utils.toastr.error('Organization ID not found', 'Error');
      return;
    }

    const payload = {
      auditReportId: report.auditReportId,
      organizationId: orgId,
      freezeReport: true
    };

    this.auditLibraryService.FreezeAuditReport(payload).subscribe({
      next: (res) => {
        this.utils.toastr.success(`Report "${report.reportNumber}" has been frozen successfully`, 'Report Frozen');
        this.refreshReports();
      },
      error: (err) => {
        this.utils.toastr.error('Failed to freeze report. Please try again.', 'Error');
      }
    });
  }

  onAddComment(report: AuditReport): void {
    this.selectedReportForComment = report;
    this.showCommentModal = true;
  }

  onUploadReport(): void {
    // Implement upload report logic here
  }

  showAddReportModal = false;
  showCommentModal = false;
  isEditMode = false;
  selectedReportForEdit: AuditReport | null = null;
  selectedReportForComment: AuditReport | null = null;

  onCreateReport(): void {
    this.isEditMode = false;
    this.selectedReportForEdit = null;
    this.showAddReportModal = true;
  }

  onAddReportClose(): void {
    this.showAddReportModal = false;
    this.isEditMode = false;
    this.selectedReportForEdit = null;
  }

  onCommentClose(): void {
    this.showCommentModal = false;
    this.selectedReportForComment = null;
  }

  onAddReportSubmit(report: any): void {
    // Refresh the audit reports after a successful add
    this.refreshReports();
    // Don't close modal here - let the child component handle closing
  }

  // Helper method to refresh reports from API
  private refreshReports(): void {
    this.loadReports();
  }

  onPreviousPage(): void {
    if (this.hasPreviousPage && this.currentPage > 1) {
      this.currentPage--;
      this.loadReports();
    }
  }

  onNextPage(): void {
    if (this.hasNextPage && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadReports();
    }
  }

  getRatingClass(ratingType: 'strong' | 'weak'): string {
    return `rating-${ratingType}`;
  }

  // Utility method to get current page reports (now returns all reports since pagination is server-side)
  getCurrentPageReports(): AuditReport[] {
    return this.reports;
  }

  // Extract rating type from full scale definition
  getRatingType(fullRating: string): string {
    if (!fullRating) return '';
    const parts = fullRating.split(' - ');
    return parts.length > 0 ? parts[0].trim() : fullRating;
  }

  // Get color for rating type
  getRatingColor(fullRating: string): string {
    const ratingType = this.getRatingType(fullRating);
    return this.ratingColorMap[ratingType] || '#6c757d'; // Default gray if not found
  }
}
