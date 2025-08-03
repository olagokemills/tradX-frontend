import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/modals/confirm-dialog/confirm-dialog.component';
import { EditColumnsDialogComponent } from 'src/app/shared/components/modals/edit-columns-dialog/edit-columns-dialog.component';
import { EditFindingDialogComponent } from 'src/app/shared/components/modals/edit-finding-dialog/edit-finding-dialog.component';
import { FilterDialogComponent } from 'src/app/shared/components/modals/filter-dialog/filter-dialog.component';
import { ViewFindingDialogComponent } from 'src/app/shared/components/modals/view-finding-dialog/view-finding-dialog.component';
import { Finding, AuditFinding, AuditFindingResponse } from 'src/app/shared/models/finding.model';
import { AuditFindingsService } from 'src/app/core/services/audit/audit-findings.service';
import { GenericService } from 'src/app/core/utils/generic-service.service';
import { ReferenceService } from 'src/app/core/services/reference/reference.service';


@Component({
  selector: 'app-audit-findings',
  templateUrl: './audit-findings.component.html',
  styleUrls: ['./audit-findings.component.scss']
})
export class AuditFindingsComponent implements OnInit, OnDestroy {
  findings: Finding[] = [];
  auditFindings: AuditFinding[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalCount: number = 0;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  showAddFindingModal = false;
  isLoadingFindings: boolean = false;
  searchTerm: string = '';

  // Route parameters
  auditReportId: string | null = null;
  organizationId: string = '';

  // Selected audit report data
  selectedAuditReport: any = null;

  // Finding details side modal
  showFindingDetailsModal = false;
  selectedFinding: any | null = null;
  isLoadingFindingDetails = false;

  // Comment side modal
  showCommentModal = false;
  findingForComment: any | null = null;

  // Close finding side modal
  showCloseFindingModal = false;
  findingToClose: any | null = null;
  closureTypes: string[] = [];
  closeFindingForm = {
    closureType: '',
    dateRemediated: null as Date | null,
    closureComment: '',
    fileName: '',
    base64String: ''
  };

  // Rating color map based on the provided data
  ratingColorMap: Record<string, string> = {
    'Unsatisfactory': '#dc3545',
    'Weak': '#fd7e14',
    'Needs Improvement': '#ffc107',
    'Satisfactory': '#20c997',
    'Strong': '#28a745',
    'Exemplary': '#007bff'
  };

  // Search functionality
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditFindingsService: AuditFindingsService,
    private dialog: MatDialog,
    private utils: GenericService,
    private referenceService: ReferenceService
  ) { }

  ngOnInit(): void {
    // Get organization ID from localStorage
    this.organizationId = localStorage.getItem('organizationId') as string;

    // Get route parameter if present
    this.auditReportId = this.route.snapshot.paramMap.get('auditReportId');

    // Get selected audit report from sessionStorage if navigated from report library
    const storedReport = sessionStorage.getItem('selectedAuditReport');
    if (storedReport) {
      this.selectedAuditReport = JSON.parse(storedReport);
      // Clear from sessionStorage after retrieving
      sessionStorage.removeItem('selectedAuditReport');
    }

    // Setup search debounce
    this.setupSearchDebounce();

    // Load closure types
    this.loadClosureTypes();

    // Load findings based on route
    this.loadFindings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClosureTypes(): void {
    this.referenceService.getClosureTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            this.closureTypes = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading closure types:', error);
        }
      });
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
        this.loadFindings();
      });
  }

  private loadFindings(): void {
    this.isLoadingFindings = true;

    const params = {
      organizationId: this.organizationId,
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      searchQuery: this.searchTerm || undefined
    };

    // Choose API method based on route
    const apiCall = this.auditReportId
      ? this.auditFindingsService.GetAuditFindingsByReport({ ...params, reportId: this.auditReportId })
      : this.auditFindingsService.GetAuditFindings(params);

    apiCall
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: AuditFindingResponse) => {
          if (response.isSuccess && response.data) {
            this.auditFindings = response.data;
            this.findings = this.mapAuditFindingsToFindings(response.data);
            this.totalCount = response.totalCount || 0;
            this.totalPages = response.totalPages || 1;
            this.hasNextPage = response.hasNextPage || false;
            this.hasPreviousPage = response.hasPreviousPage || false;
          } else {
            this.handleApiError(response.errorMessage || 'Failed to load findings');
          }
        },
        error: (error) => {
          this.handleApiError('Failed to load findings');
          console.error('Error loading findings:', error);
        },
        complete: () => {
          this.isLoadingFindings = false;
        }
      });
  }

  private mapAuditFindingsToFindings(auditFindings: AuditFinding[]): Finding[] {
    return auditFindings.map(af => ({
      id: af.serialNumber,
      closureDate: new Date(af.agreedClosureDate),
      priority: this.mapPriorityLevel(af.priorityLevel),
      title: af.findingTitle,
      category: af.findingCategory,
      description: af.auditObservation,
      recommendation: af.recommendation,
      status: 'Open', // Default status, adjust as needed
      issueOwner: af.issueOwner,
      managementActionPlan: af.managementActionPlan,
      bookmarked: af.bookmarked,
      frozen: af.freezeFindings,
      auditFindingId: af.auditFindingId,
    }));
  }

  private mapPriorityLevel(priorityLevel: string): 'Major' | 'Minor' {
    // Map API priority level to component priority
    const numericLevel = parseInt(priorityLevel);
    return numericLevel >= 4 ? 'Major' : 'Minor';
  }

  private handleApiError(message: string): void {
    this.findings = [];
    this.auditFindings = [];
    this.utils.toastr.error(message, 'Error');
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onNextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadFindings();
    }
  }

  onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.loadFindings();
    }
  }

  onAddFinding(finding: any): void {
    // Close the modal first

    // The finding parameter should contain the response from the successful API call
    // Only show success message and reload if we actually have a finding
    if (finding) {
      this.showAddFindingModal = false;

      this.loadFindings();
      this.utils.toastr.success('Finding added successfully');
    }
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
    this.utils.toastr.info(`Downloading ${fileName}...`);
  }

  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.findings = this.findings.map(f => ({ ...f, selected: checked }));
  }

  toggleBookmark(finding: Finding) {
    // Find the corresponding audit finding to get the auditFindingId
    const auditFinding = this.auditFindings.find(af => af.serialNumber === finding.id);
    if (!auditFinding) {
      this.utils.toastr.error('Unable to find audit finding details');
      return;
    }

    const newBookmarkState = !finding.bookmarked;
    const payload = {
      auditFindingId: auditFinding.auditFindingId,
      organizationId: this.organizationId,
      bookmark: newBookmarkState
    };

    this.auditFindingsService.BookmarkAuditFinding(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            // Update the local state
            finding.bookmarked = newBookmarkState;
            const action = newBookmarkState ? 'added to' : 'removed from';
            this.utils.toastr.success(`Finding ${action} bookmarks`);

            // Update the corresponding audit finding as well
            const auditFindingIndex = this.auditFindings.findIndex(af => af.auditFindingId === auditFinding.auditFindingId);
            if (auditFindingIndex !== -1) {
              this.auditFindings[auditFindingIndex].bookmarked = newBookmarkState;
            }
          } else {
            this.utils.toastr.error(response.errorMessage || 'Failed to update bookmark');
          }
        },
        error: (error) => {
          this.utils.toastr.error('Failed to update bookmark');
          console.error('Error updating bookmark:', error);
        }
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

  // New method to view finding details in side modal
  viewFindingDetails(finding: AuditFinding) {
    this.isLoadingFindingDetails = true;
    this.showFindingDetailsModal = true;

    this.auditFindingsService.GetAuditFindingById(this.organizationId, finding.auditFindingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.selectedFinding = response.data
          console.log('Finding details loaded:', this.selectedFinding);
          this.isLoadingFindingDetails = false;
        },
        error: (error) => {
          console.error('Error loading finding details:', error);
          this.utils.toastr.error('Failed to load finding details');
          this.isLoadingFindingDetails = false;
          this.showFindingDetailsModal = false;
        }
      });
  }

  // Row click handler
  onRowClick(finding: AuditFinding) {
    this.viewFindingDetails(finding);
  }

  // Close finding details modal
  closeFindingDetailsModal() {
    this.showFindingDetailsModal = false;
    this.selectedFinding = null;
  }

  // Toggle bookmark for the selected finding in details modal
  toggleBookmarkDetails() {
    if (!this.selectedFinding) return;

    const newBookmarkState = !this.selectedFinding.bookmarked;
    const payload = {
      auditFindingId: this.selectedFinding.auditFindingId,
      organizationId: this.organizationId,
      bookmark: newBookmarkState
    };

    this.auditFindingsService.BookmarkAuditFinding(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            // Update the selected finding state
            this.selectedFinding.bookmarked = newBookmarkState;

            // Also update the finding in the main list using serialNumber
            const finding = this.findings.find(f => f.id === this.selectedFinding.serialNumber);
            if (finding) {
              finding.bookmarked = newBookmarkState;
            }

            // Update the corresponding audit finding as well
            const auditFinding = this.auditFindings.find(af => af.auditFindingId === this.selectedFinding.auditFindingId);
            if (auditFinding) {
              auditFinding.bookmarked = newBookmarkState;
            }

            const action = newBookmarkState ? 'added to' : 'removed from';
            this.utils.toastr.success(`Finding ${action} bookmarks`);
          } else {
            this.utils.toastr.error(response.errorMessage || 'Failed to update bookmark');
          }
        },
        error: (error) => {
          this.utils.toastr.error('Failed to update bookmark');
          console.error('Error updating bookmark:', error);
        }
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
          this.utils.toastr.success('Finding updated successfully');
        }
      }
    });
  }

  closeFinding(finding: any) {
    this.findingToClose = finding;
    this.resetCloseFindingForm();
    this.showCloseFindingModal = true;
  }

  resetCloseFindingForm() {
    this.closeFindingForm = {
      closureType: '',
      dateRemediated: null,
      closureComment: '',
      fileName: '',
      base64String: ''
    };
  }

  closeCloseFindingModal() {
    this.showCloseFindingModal = false;
    this.findingToClose = null;
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.closeFindingForm.fileName = file.name;

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(',')[1]; // Remove data URL part
          this.closeFindingForm.base64String = base64String;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  submitCloseFinding() {
    if (!this.closeFindingForm.closureType || !this.closeFindingForm.dateRemediated) {
      this.utils.toastr.error('Please fill all required fields');
      return;
    }

    // Get the auditFindingId from the finding
    const auditFindingId = this.findingToClose.auditFindingId || this.findingToClose.id;

    const payload = {
      organizationId: this.organizationId,
      auditFindingId: auditFindingId,
      closureType: this.closeFindingForm.closureType,
      closureComment: this.closeFindingForm.closureComment,
      dateRemediated: this.closeFindingForm.dateRemediated,
      fileName: this.closeFindingForm.fileName,
      base64String: this.closeFindingForm.base64String
    };

    this.auditFindingsService.CloseFinding(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.utils.toastr.success('Finding closed successfully');

            // Update finding status in the list
            const findingId = this.findingToClose.id || this.findingToClose.serialNumber;
            const index = this.findings.findIndex(f => f.id === findingId);
            if (index !== -1) {
              this.findings[index] = { ...this.findings[index], status: 'Closed' };
            }

            // If this is the currently selected finding, update it
            if (this.selectedFinding && this.selectedFinding.auditFindingId === auditFindingId) {
              this.selectedFinding.status = 'Closed';
            }

            this.closeCloseFindingModal();
          } else {
            this.utils.toastr.error(response.errorMessage || 'Failed to close finding');
          }
        },
        error: (error) => {
          this.utils.toastr.error('Failed to close finding');
          console.error('Error closing finding:', error);
        }
      });
  }

  addComment(finding: any) {
    console.log('Adding comment for finding:', finding);
    this.findingForComment = finding;
    this.showCommentModal = true;
  }

  closeCommentModal() {
    this.showCommentModal = false;
    this.findingForComment = null;
    // Refresh findings after adding a comment
    this.loadFindings();
  } triggerReminder(finding: Finding) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Trigger Reminder',
        message: 'Are you sure you want to send a reminder for this finding?',
        confirmText: 'Send Reminder',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Implement trigger reminder logic
        this.utils.toastr.success('Reminder sent successfully');
      }
    });
  }

  viewUpdates(finding: any) {
    // Get auditFindingId from the finding
    const auditFindingId = finding.auditFindingId || finding.id;
    const reportId = this.auditReportId || '';

    // In a real implementation, we would fetch updates and display them
    this.auditFindingsService.GetAuditFindingUpdates({
      organizationId: this.organizationId,
      reportId: reportId,
      pageNumber: 1,
      pageSize: 10
    }).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          // Show updates in a dialog or another side modal
          this.utils.toastr.success(`Found ${response.data.length} updates for this finding`);
        } else {
          this.utils.toastr.info('No updates found for this finding');
        }
      },
      error: (error) => {
        console.error('Error fetching updates:', error);
        this.utils.toastr.error('Failed to fetch updates');
      }
    });
  }

  uploadDocument(finding: any) {
    // Create file input and trigger click
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Read file as base64
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const base64String = reader.result.toString().split(',')[1]; // Remove data URL part

            // Get auditFindingId from the finding
            const auditFindingId = finding.auditFindingId || finding.id;

            // Upload the document
            this.auditFindingsService.UploadAuditFindingDocument({
              organizationId: this.organizationId,
              auditFindingId: auditFindingId,
              base64String: base64String,
              fileName: file.name
            }).subscribe({
              next: (response) => {
                if (response.isSuccess) {
                  this.utils.toastr.success('Document uploaded successfully');
                } else {
                  this.utils.toastr.error(response.errorMessage || 'Failed to upload document');
                }
              },
              error: (error) => {
                console.error('Error uploading document:', error);
                this.utils.toastr.error('Failed to upload document');
              }
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  freezeFinding(finding: Finding) {
    const isCurrentlyFrozen = finding.frozen || false;
    const action = isCurrentlyFrozen ? 'unfreeze' : 'freeze';
    const actionTitle = isCurrentlyFrozen ? 'Unfreeze Finding' : 'Freeze Finding';
    const actionMessage = isCurrentlyFrozen
      ? 'Are you sure you want to unfreeze this finding? This will restore access to it.'
      : 'Are you sure you want to freeze this finding? This action will restrict access to it.';

    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: actionTitle,
        message: actionMessage,
        confirmText: isCurrentlyFrozen ? 'Unfreeze' : 'Freeze',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // Get the auditFindingId from the auditFindings array
        const auditFinding = this.auditFindings.find(af => af.serialNumber === finding.id);
        if (!auditFinding) {
          this.utils.toastr.error('Finding not found');
          return;
        }

        const freezePayload = {
          auditFindingId: auditFinding.auditFindingId,
          organizationId: this.organizationId,
          freezeFinding: !isCurrentlyFrozen
        };

        this.auditFindingsService.FreezeAuditFinding(freezePayload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.isSuccess) {
                // Update the finding in the local array to reflect frozen state
                const index = this.findings.findIndex(f => f.id === finding.id);
                if (index !== -1) {
                  this.findings[index] = { ...this.findings[index], frozen: !isCurrentlyFrozen };
                }
                // Also update the auditFindings array
                const auditIndex = this.auditFindings.findIndex(af => af.auditFindingId === auditFinding.auditFindingId);
                if (auditIndex !== -1) {
                  this.auditFindings[auditIndex] = { ...this.auditFindings[auditIndex], freezeFindings: !isCurrentlyFrozen };
                }
                this.utils.toastr.success(`Finding ${action}d successfully`);
              } else {
                this.utils.toastr.error(response.errorMessage || `Failed to ${action} finding`);
              }
            },
            error: (error) => {
              this.utils.toastr.error(`Failed to ${action} finding`);
              console.error(`Error ${action}ing finding:`, error);
            }
          });
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.onSearch();
  }

  bookmark(finding: Finding) {
    finding.bookmarked = !finding.bookmarked;
  }

  // Extract rating type from full rating string (e.g., "Weak - Rating" -> "Weak")
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

  goBack(): void {
    this.router.navigate(['/audit-library/audit-report-library']);
  }
}
