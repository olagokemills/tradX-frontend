// GET /api/v1/audit-report/audit-report/organization/{organizationId}/report/{auditReportId}
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

interface CreateAuditReportPayload {
  organizationId: string | number;
  reportNumber: string;
  reportDate: string;
  entity: string | number;
  overallRating: string;
  otherUniqueIdentifier: string;
  quarter: string;
  auditName: string;
  auditYear: string;
  summaryScope: string;
}

export interface FreezeAuditReportPayload {
  auditReportId: string;
  organizationId: string;
  freezeReport: boolean;
}

export interface BookmarkAuditReportPayload {
  auditReportId: string;
  organizationId: string;
  bookmark: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuditLibraryService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';
  constructor(private http: HttpClient) { }

  CreateAuditReport(payload: CreateAuditReportPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-report/audit-report`, payload);
  }

  // GET /api/v1/audit-report/audit-report/organization/{organizationId}/report/{auditReportId}
  GetAuditReportById(organizationId: string, auditReportId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}audit-report/audit-report/organization/${organizationId}/report/${auditReportId}`);
  }

  // GET /api/v1/audit-report/audit-reports/{organizationId} with query params
  GetAuditReports(params: {
    organizationId: string,
    reportNumber?: string,
    reportStartDate?: string,
    reportEndDate?: string,
    entity?: string,
    overrallRating?: string,
    otherUniqueIdentifier?: string,
    quarter?: string,
    auditName?: string,
    pageNumber?: number,
    pageSize?: number,
    searchQuery?: string
  }): Observable<any> {
    const {
      organizationId,
      reportNumber,
      reportStartDate,
      reportEndDate,
      entity,
      overrallRating,
      otherUniqueIdentifier,
      quarter,
      auditName,
      pageNumber,
      pageSize,
      searchQuery
    } = params;
    let query = '';
    const q: string[] = [];
    if (reportNumber) q.push(`reportNumber=${encodeURIComponent(reportNumber)}`);
    if (reportStartDate) q.push(`reportStartDate=${encodeURIComponent(reportStartDate)}`);
    if (reportEndDate) q.push(`reportEndDate=${encodeURIComponent(reportEndDate)}`);
    if (entity) q.push(`entity=${encodeURIComponent(entity)}`);
    if (overrallRating) q.push(`overrallRating=${encodeURIComponent(overrallRating)}`);
    if (otherUniqueIdentifier) q.push(`otherUniqueIdentifier=${encodeURIComponent(otherUniqueIdentifier)}`);
    if (quarter) q.push(`quarter=${encodeURIComponent(quarter)}`);
    if (auditName) q.push(`auditName=${encodeURIComponent(auditName)}`);
    if (pageNumber !== undefined) q.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) q.push(`pageSize=${pageSize}`);
    if (searchQuery) q.push(`searchQuery=${encodeURIComponent(searchQuery)}`);
    if (q.length) query = '?' + q.join('&');
    return this.http.get<any>(`${this.baseUrl}audit-report/audit-reports/${organizationId}${query}`);
  }

  // POST /api/v1/audit-report/modify-audit-report
  ModifyAuditReport(body: CreateAuditReportPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-report/modify-audit-report`, body);
  }

  // POST /api/v1/audit-report/freeze-audit-report
  FreezeAuditReport(body: FreezeAuditReportPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-report/freeze-audit-report`, body);
  }

  // POST /api/v1/audit-report/bookmark-audit-report
  BookmarkAuditReport(body: BookmarkAuditReportPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-report/bookmark-audit-report`, body);
  }
}
