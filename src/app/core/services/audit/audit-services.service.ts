import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthPoints } from 'src/app/shared/constants/services';

@Injectable({
  providedIn: 'root',
})
export class AuditServicesService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';

  constructor(private http: HttpClient) {}

  FetchAuditPlans(body: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}${AuthPoints.login}`,
      body
    );
  }

  CreateAuditPlan() {}
  EditAuditPlan() {}
  DeleteAuditPlan(data: number) {
    return this.http.post<>('', data);
  }
}
