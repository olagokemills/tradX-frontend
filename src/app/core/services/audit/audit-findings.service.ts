import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuditFinding,
  AuditFindingResponse,
  AuditFindingUserResponse,
  SavedFindingResponse,
  CreateAuditFindingPayload,
  ModifyAuditFindingPayload,
  FreezeAuditFindingPayload,
  BookmarkAuditFindingPayload,
  AuditFindingCommentResponse,
  AuditFindingUpdateResponse,
  SimpleMessageResponse
} from 'src/app/shared/models/finding.model';

@Injectable({
  providedIn: 'root'
})
export class AuditFindingsService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';

  constructor(private http: HttpClient) { }

  /**
   * GET /api/v1/audit-findings/user-list/{organizationId}
   * Get list of users for audit findings
   */
  GetUserList(organizationId: string): Observable<AuditFindingUserResponse> {
    return this.http.get<AuditFindingUserResponse>(`${this.baseUrl}audit-findings/user-list/${organizationId}`);
  }

  /**
   * GET /api/v1/audit-findings/saved-findings/{organizationId}
   * Get saved audit findings with pagination and search
   */
  GetSavedFindings(params: {
    organizationId: string;
    pageNumber?: number;
    pageSize?: number;
    searchQuery?: string;
  }): Observable<SavedFindingResponse> {
    const { organizationId, pageNumber, pageSize, searchQuery } = params;
    let query = '';
    const q: string[] = [];

    if (pageNumber !== undefined) q.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) q.push(`pageSize=${pageSize}`);
    if (searchQuery) q.push(`searchQuery=${encodeURIComponent(searchQuery)}`);

    if (q.length) query = '?' + q.join('&');

    return this.http.get<SavedFindingResponse>(`${this.baseUrl}audit-findings/saved-findings/${organizationId}${query}`);
  }

  /**
   * GET /api/v1/audit-findings/audit-findings/{organizationId}
   * Get audit findings for an organization with pagination and search
   */
  GetAuditFindings(params: {
    organizationId: string;
    pageNumber?: number;
    pageSize?: number;
    searchQuery?: string;
  }): Observable<AuditFindingResponse> {
    const { organizationId, pageNumber, pageSize, searchQuery } = params;
    let query = '';
    const q: string[] = [];

    if (pageNumber !== undefined) q.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) q.push(`pageSize=${pageSize}`);
    if (searchQuery) q.push(`searchQuery=${encodeURIComponent(searchQuery)}`);

    if (q.length) query = '?' + q.join('&');

    return this.http.get<AuditFindingResponse>(`${this.baseUrl}audit-findings/audit-findings/${organizationId}${query}`);
  }

  /**
   * GET /api/v1/audit-findings/audit-findings/{organizationId}/findings/{reportId}
   * Get audit findings for a specific report with pagination and search
   */
  GetAuditFindingsByReport(params: {
    organizationId: string;
    reportId: string;
    pageNumber?: number;
    pageSize?: number;
    searchQuery?: string;
  }): Observable<AuditFindingResponse> {
    const { organizationId, reportId, pageNumber, pageSize, searchQuery } = params;
    let query = '';
    const q: string[] = [];

    if (pageNumber !== undefined) q.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) q.push(`pageSize=${pageSize}`);
    if (searchQuery) q.push(`searchQuery=${encodeURIComponent(searchQuery)}`);

    if (q.length) query = '?' + q.join('&');

    return this.http.get<AuditFindingResponse>(`${this.baseUrl}audit-findings/audit-findings/${organizationId}/findings/${reportId}${query}`);
  }

  /**
   * GET /api/v1/audit-findings/audit-finding/organization/{organizationId}/finding/{auditFindingId}
   * Get a specific audit finding by ID
   */
  GetAuditFindingById(organizationId: string, auditFindingId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}audit-findings/audit-finding/organization/${organizationId}/finding/${auditFindingId}`);
  }

  /**
   * POST /api/v1/audit-findings/audit-finding
   * Create a new audit finding
   */
  CreateAuditFinding(payload: CreateAuditFindingPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-findings/audit-finding`, payload);
  }

  /**
   * POST /api/v1/audit-findings/modify-audit-finding
   * Modify an existing audit finding
   */
  ModifyAuditFinding(payload: ModifyAuditFindingPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-findings/modify-audit-finding`, payload);
  }

  /**
   * POST /api/v1/audit-findings/freeze-audit-finding
   * Freeze or unfreeze an audit finding
   */
  FreezeAuditFinding(payload: FreezeAuditFindingPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-findings/freeze-audit-finding`, payload);
  }

  /**
   * POST /api/v1/audit-findings/bookmark-audit-finding
   * Bookmark or unbookmark an audit finding
   */
  BookmarkAuditFinding(payload: BookmarkAuditFindingPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-findings/bookmark-audit-finding`, payload);
  }

  /**
   * GET /api/v1/audit-findings/audit-finding-comment
   * Get comments for an audit finding with pagination and search
   */
  GetAuditFindingComments(params: {
    organizationId: string;
    reportId: string;
    pageNumber?: number;
    pageSize?: number;
    searchQuery?: string;
  }): Observable<AuditFindingCommentResponse> {
    const { organizationId, reportId, pageNumber, pageSize, searchQuery } = params;
    let query = '';
    const q: string[] = [];

    q.push(`organizationId=${organizationId}`);
    q.push(`reportId=${reportId}`);
    if (pageNumber !== undefined) q.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) q.push(`pageSize=${pageSize}`);
    if (searchQuery) q.push(`searchQuery=${encodeURIComponent(searchQuery)}`);

    if (q.length) query = '?' + q.join('&');

    return this.http.get<AuditFindingCommentResponse>(`${this.baseUrl}audit-findings/audit-finding-comment${query}`);
  }

  /**
   * POST /api/v1/audit-findings/audit-finding-comment
   * Add a comment to an audit finding
   */
  AddAuditFindingComment(payload: {
    organizationId: string;
    auditFindingId: string;
    comment: string;
  }): Observable<SimpleMessageResponse> {
    return this.http.post<SimpleMessageResponse>(`${this.baseUrl}audit-findings/audit-finding-comment`, payload);
  }

  /**
   * GET /api/v1/audit-findings/audit-finding-update
   * Get updates for an audit finding with pagination and search
   */
  GetAuditFindingUpdates(params: {
    organizationId: string;
    reportId: string;
    pageNumber?: number;
    pageSize?: number;
    searchQuery?: string;
  }): Observable<AuditFindingUpdateResponse> {
    const { organizationId, reportId, pageNumber, pageSize, searchQuery } = params;
    let query = '';
    const q: string[] = [];

    q.push(`organizationId=${organizationId}`);
    q.push(`reportId=${reportId}`);
    if (pageNumber !== undefined) q.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) q.push(`pageSize=${pageSize}`);
    if (searchQuery) q.push(`searchQuery=${encodeURIComponent(searchQuery)}`);

    if (q.length) query = '?' + q.join('&');

    return this.http.get<AuditFindingUpdateResponse>(`${this.baseUrl}audit-findings/audit-finding-update${query}`);
  }

  /**
   * POST /api/v1/audit-findings/audit-finding-document-upload
   * Upload a document for an audit finding
   */
  UploadAuditFindingDocument(payload: {
    organizationId: string;
    auditFindingId: string;
    base64String: string;
    fileName: string;
  }): Observable<SimpleMessageResponse> {
    return this.http.post<SimpleMessageResponse>(`${this.baseUrl}audit-findings/audit-finding-document-upload`, payload);
  }

  /**
   * POST /api/v1/audit-findings/close-finding
   * Close an audit finding
   */
  CloseFinding(payload: {
    organizationId: string;
    auditFindingId: string;
    closureType: string;
    closureComment: string;
    dateRemediated: Date;
    fileName?: string;
    base64String?: string;
  }): Observable<SimpleMessageResponse> {
    return this.http.post<SimpleMessageResponse>(`${this.baseUrl}audit-findings/close-finding`, payload);
  }
}
