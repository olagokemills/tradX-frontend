export interface ReportRating {
  id: number;
  organizationId: string;
  scaleDefinition: string;
  colourCode: string;
}

export interface ReportRatingResponse {
  data: ReportRating[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPoints } from 'src/app/shared/constants/services';
import {
  CreateUserPayload,
  DepartmentResponse,
  ModifyStatusPayload,
  RoleResponse,
  UserPayload,
  UserResponse,
} from 'src/app/shared/models/appData.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';
  constructor(private http: HttpClient) { }

  GetUsers(data: UserPayload): Observable<UserResponse> {
    return this.http.get<any>(
      `${this.baseUrl}${EndPoints.getUsers}/${data.organizationId}?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&searchQuery=${data.searchQuery}`
    );
  }

  GetOrgRoles(): Observable<RoleResponse> {
    return this.http.get<any>(`${this.baseUrl}${EndPoints.getRoles}`);
  }

  GetDept(): Observable<DepartmentResponse> {
    return this.http.get<any>(`${this.baseUrl}${EndPoints.getDepts}`);
  }

  GetUserRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${EndPoints.getUserRoles}`);
  }

  CreateUser(body: CreateUserPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${EndPoints.createUser}`, body);
  }

  ModifyUser(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${EndPoints.modifyUser}`, body);
  }

  ToggleUserstatus(body: ModifyStatusPayload): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${EndPoints.toggleUserStatus}`,
      body
    );
  }
  ModifyUserStatus(body: ModifyStatusPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user/modify-user-status`, body);
  }
  FetchOrganizationLogo(organizationId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}user/organization-logo/${organizationId}`
    );
  }
  DeleteUser(userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user/delete-user`, {
      userId: userId,
    });
  }

  GetReportRatings(organizationId: string): Observable<ReportRatingResponse> {
    return this.http.get<ReportRatingResponse>(`${this.baseUrl}user/report-rating/${organizationId}`);
  }
}
