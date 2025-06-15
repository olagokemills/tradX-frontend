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

  ModifyAudit(data: CreateAuditPayload): Observable<any> {
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
  // DeleteAuditPlan(data: number) {
  //   return this.http.post<any></any>('', data);
  // }
}
