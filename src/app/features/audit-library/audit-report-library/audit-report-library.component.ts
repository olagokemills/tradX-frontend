import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-report-library',
  templateUrl: './audit-report-library.component.html',
  styleUrls: ['./audit-report-library.component.scss']
})
export class AuditReportLibraryComponent implements OnInit {
  reports: any[] = []; // Replace with your reports interface

  constructor() { }

  ngOnInit(): void {
    // Load your reports data here
  }
}
