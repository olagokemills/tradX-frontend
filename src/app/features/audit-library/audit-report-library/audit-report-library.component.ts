import { Component, OnInit } from '@angular/core';

interface AuditReport {
  id: string;
  date: string;
  entity: string;
  overallRating: string;
  ratingType: 'strong' | 'weak';
  otherUniqueIdentifier: string;
  quarter: string;
  auditName: string;
}

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

  constructor() { }

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    // Mock data that matches the design exactly
    this.reports = [
      {
        id: '#97174',
        date: '15 May 2020 8:00 am',
        entity: 'Nigeria',
        overallRating: 'Weak',
        ratingType: 'weak',
        otherUniqueIdentifier: 'Sharply Africa, Sharply',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#39635',
        date: '15 May 2020 9:30 am',
        entity: 'Nigeria',
        overallRating: 'Strong',
        ratingType: 'strong',
        otherUniqueIdentifier: 'Sharply Nigeria,Sharply Africa',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#43178',
        date: '15 May 2020 8:30 am',
        entity: 'Nigeria',
        overallRating: 'Weak',
        ratingType: 'weak',
        otherUniqueIdentifier: 'Sharply, Sharply Africa',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#70668',
        date: '15 May 2020 9:30 am',
        entity: 'Nigeria',
        overallRating: 'Strong',
        ratingType: 'strong',
        otherUniqueIdentifier: 'Sharply',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#22739',
        date: '15 May 2020 8:30 am',
        entity: 'Nigeria',
        overallRating: 'Strong',
        ratingType: 'strong',
        otherUniqueIdentifier: 'Sharply Africa',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#43756',
        date: '15 May 2020 9:30 am',
        entity: 'Nigeria',
        overallRating: 'Weak',
        ratingType: 'weak',
        otherUniqueIdentifier: 'Sharply Africa',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#97174',
        date: '15 May 2020 9:00 am',
        entity: 'Nigeria',
        overallRating: 'Weak',
        ratingType: 'weak',
        otherUniqueIdentifier: 'Sharply Nigeria',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      },
      {
        id: '#22739',
        date: '15 May 2020 8:00 am',
        entity: 'Nigeria',
        overallRating: 'Weak',
        ratingType: 'weak',
        otherUniqueIdentifier: 'Sharply Africa',
        quarter: 'Q1',
        auditName: 'Lorem Ipsum'
      }
    ];

    this.filteredReports = [...this.reports];
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReports = [...this.reports];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredReports = this.reports.filter(report =>
      report.id.toLowerCase().includes(searchLower) ||
      report.entity.toLowerCase().includes(searchLower) ||
      report.overallRating.toLowerCase().includes(searchLower) ||
      report.otherUniqueIdentifier.toLowerCase().includes(searchLower) ||
      report.quarter.toLowerCase().includes(searchLower) ||
      report.auditName.toLowerCase().includes(searchLower)
    );
  }

  onFilter(): void {
    // Implement filter functionality
    console.log('Opening filter options');
    // You can add modal or dropdown filter logic here
  }

  onDownloadReport(): void {
    // Implement download functionality
    console.log('Downloading report');
    // You can add CSV/Excel export logic here
  }

  onAddReport(): void {
    // Implement add report functionality
    console.log('Adding new report');
    // You can add modal or navigation logic here
  }

  onMoreOptions(report: AuditReport): void {
    // Implement more options functionality
    console.log('More options for report:', report.id);
    // You can add dropdown menu or modal logic here
  }

  onUploadReport(): void {
    console.log('Opening upload report dialog');
    // Implement upload report logic here
  }

  showAddReportModal = false;

  onCreateReport(): void {
    this.showAddReportModal = true;
  }

  onAddReportClose(): void {
    this.showAddReportModal = false;
  }

  onAddReportSubmit(report: any): void {
    console.log('New report data:', report);
    // Implement the API call to save the report
    this.showAddReportModal = false;
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
}
