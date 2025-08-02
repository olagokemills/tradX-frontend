import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuditLibraryService } from 'src/app/core/services/audit/audit-library.service';
import { AuditReport } from 'src/app/shared/models/audit-report.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/modals/confirm-dialog/confirm-dialog.component';
import { GenericService } from 'src/app/core/utils/generic-service.service';

@Component({
  selector: 'app-audit-report-library',
  templateUrl: './audit-report-library.component.html',
  styleUrls: ['./audit-report-library.component.scss']
})
export class AuditReportLibraryComponent implements OnInit {
  reports: AuditReport[] = [];
  filteredReports: AuditReport[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 2;
  itemsPerPage: number = 8;

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
    private utils: GenericService
  ) { }

  ngOnInit(): void {
    this.loadReports();
    const orgId = localStorage.getItem('organizationId') as string;
    this.auditLibraryService.GetAuditReports(
      {
        organizationId: orgId
      }
    ).subscribe({
      next: (res) => {
        this.reports = res.data || [];
        this.filteredReports = [...this.reports];
      },
      error: (err) => {
        // Error handling without console log
      }
    });
  }

  private loadReports(): void {
    // Mock data that matches the design exactly
    this.reports = [];

    this.filteredReports = [...this.reports];
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReports = [...this.reports];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredReports = this.reports.filter(report =>
      report.auditReportId.toLowerCase().includes(searchLower) ||
      report.entity.toLowerCase().includes(searchLower) ||
      report.overallRating.toLowerCase().includes(searchLower) ||
      report.otherUniqueIdentifier.toLowerCase().includes(searchLower) ||
      report.quarter.toLowerCase().includes(searchLower) ||
      report.auditName.toLowerCase().includes(searchLower)
    );
  }

  onFilter(): void {
    // Implement filter functionality
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
    // Implement add comment functionality
    // You can open a comment modal or navigate to comment section
  }

  onUploadReport(): void {
    // Implement upload report logic here
  }

  showAddReportModal = false;
  isEditMode = false;
  selectedReportForEdit: AuditReport | null = null;

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

  onAddReportSubmit(report: any): void {
    // Refresh the audit reports after a successful add
    this.refreshReports();
    // Don't close modal here - let the child component handle closing
  }

  // Helper method to refresh reports from API
  private refreshReports(): void {
    const orgId = localStorage.getItem('organizationId') as string;
    this.auditLibraryService.GetAuditReports({ organizationId: orgId }).subscribe({
      next: (res) => {
        this.reports = res.data || [];
        this.filteredReports = [...this.reports];
        this.updatePagination();
      },
      error: (err) => {
        this.utils.toastr.error('Failed to refresh reports', 'Error');
      }
    });
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getRatingClass(ratingType: 'strong' | 'weak'): string {
    return `rating-${ratingType}`;
  }

  // Utility method to get current page reports
  getCurrentPageReports(): AuditReport[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReports.slice(startIndex, endIndex);
  }

  // Method to calculate total pages based on filtered results
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReports.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
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
