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
  SaveCompanyOnboardingInfo(
    data: OrganizationPayload
  ): Observable<OrganizationPayloadResponse> {
    return this.http.post<OrganizationPayloadResponse>(
      `${this.baseUrl}${AuthPoints.organization}`,
      data
    );
  }
}
