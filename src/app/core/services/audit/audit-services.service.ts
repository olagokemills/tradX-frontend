import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditPoints } from 'src/app/shared/constants/services';
import {
  CreateAuditPayload,
  LoginPayload,
  LoginResponse,
} from 'src/app/shared/models/appData.model';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';

  constructor(private http: HttpClient) {}

  FetchAuditPlans(yearId: string, organizationId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}${AuditPoints.getAuditPlans}${yearId}/organization/${organizationId}`
    );
  }

  GetAudityear(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${AuditPoints.getAuditYears}`);
  }

  CreateAuditPlan(data: any): Observable<CreateAuditPayload> {
    return this.http.post<any>(
      `${this.baseUrl}${AuditPoints.createAuditPlan}`,
      data
    );
  }

  ModifyAudit(data: {
    auditPlanId: string;
    auditTitle: string;
    departmentId: number;
    status: string;
    proposedTiming: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${AuditPoints.modifyAudit}`,
      data
    );
  }
  FetchCurrentYearAudit(orgId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}${AuditPoints.currentYearPlans}${orgId}`
    );
  }
  FetchRemovedAudits(orgId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}audit-plan/deleted-audit-plans/organization/${orgId}`
    );
  }
  // DeleteAuditPlan(data: number) {
  //   return this.http.post<any></any>('', data);
  // }

  FetchAuditYearList(orgId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}audit-plan/audit-year/${orgId}`);
  }

  createAuditYear({
    organizationId,
    year,
  }: {
    organizationId: string;
    year: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-plan/audit-year`, {
      organizationId,
      year,
    });
  }

  FetchAuditList() {
    return this.http.get<any>(`${this.baseUrl}audit-plan/audit-list`);
  }
  ModifyAuditTiming({
    auditPlanId,
    proposedTiming,
  }: {
    auditPlanId: string;
    proposedTiming: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}audit-plan/modify-proposed-timing`,
      { auditPlanId, proposedTiming }
    );
  }
  removeAudit({
    auditId,
    organizationId,
  }: {
    auditId: string;
    organizationId: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-plan/delete-audit-plan`, {
      auditId,
      organizationId,
    });
  }
  UpdateAuditStatus({
    status,
    auditPlanId,
  }: {
    status: string;
    auditPlanId: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-plan/modify-audit-plan`, {
      status,
      auditPlanId,
    });
  }
  FreezeAudit({
    auditPlanId,
    organizationId,
  }: {
    auditPlanId: string;
    organizationId: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}audit-plan/freeze-audit-plan`, {
      auditPlanId,
      organizationId,
      freezePlan: true,
    });
  }
}
