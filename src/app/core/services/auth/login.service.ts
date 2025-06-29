import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthPoints } from 'src/app/shared/constants/services';
import {
  LoginPayload,
  LoginResponse,
  OrganizationPayload,
  OrganizationPayloadResponse,
  RegisterPayload,
  RegisterResponse,
} from 'src/app/shared/models/appData.model';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';
  constructor(private http: HttpClient) {}

  LoginUser(body: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}${AuthPoints.login}`,
      body
    );
  }

  Register(body: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}${AuthPoints.register}`,
      body
    );
  }

  GetCountries(): Observable<any> {
    return this.http.get<RegisterResponse>(
      `${this.baseUrl}${AuthPoints.getCountries}`
    );
  }
  GetExchanges(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reference-data/stock-exchanges`);
  }

  GetIndustries(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reference-data/industries`);
  }
  SaveCompanyOnboardingInfo(
    data: OrganizationPayload
  ): Observable<OrganizationPayloadResponse> {
    return this.http.post<OrganizationPayloadResponse>(
      `${this.baseUrl}${AuthPoints.organization}`,
      data
    );
  }
  saveContactInformation(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${AuthPoints.organization}`,
      data
    );
  }

  GetOrganizationDetails(userId: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}user/user/${userId}`);
  }
}
