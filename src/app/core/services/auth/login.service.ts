import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthPoints } from 'src/app/shared/constants/services';
import {
  ContactInformationPayload,
  ContactInformationResponse,
  LoginPayload,
  LoginResponse,
  OrganizationPayload,
  OrganizationPayloadResponse,
  RegisterPayload,
  RegisterResponse,
  GenericApiResponse,
  RatingsPayload,
  RatingsResponse,
  UserResponse,
} from 'src/app/shared/models/appData.model';
import { ValidateOtpPayload, ValidateOtpResponse } from 'src/app/shared/models/validate-otp.model';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl: string = 'https://lab386.com.ng/api/v1/';
  constructor(private http: HttpClient) { }

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
  saveContactInformation(data: ContactInformationPayload): Observable<ContactInformationResponse> {
    return this.http.post<ContactInformationResponse>(
      `${this.baseUrl}${AuthPoints.contactInfo}`,
      data
    );
  }

  /**
   * Upload organization logo
   * @param organizationId The ID of the organization
   * @param base64Image The logo image as a base64 string
   * @param fileName The name of the file
   * @returns API response with success message
   */
  uploadLogo(
    organizationId: string,
    base64Image: string,
    fileName: string
  ): Observable<GenericApiResponse> {
    const payload = {
      organizationId,
      base64Image,
      fileName,
    };

    return this.http.post<GenericApiResponse>(
      `${this.baseUrl}${AuthPoints.logoUpload}`,
      payload
    );
  }

  submitRatingsConfig(payload: RatingsPayload): Observable<RatingsResponse> {
    return this.http.post<RatingsResponse>(
      `${this.baseUrl}auth/ratings`,
      payload
    );
  }

  /**
   * Get user by ID (returns user details and organizations)
   */
  getUserById(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.baseUrl}user/user/${userId}`
    );
  }

  /**
   * Validate OTP for 2FA
   */
  validateOtp(payload: ValidateOtpPayload): Observable<ValidateOtpResponse> {
    return this.http.post<ValidateOtpResponse>(
      `${this.baseUrl}auth/validate-otp`,
      payload
    );
  }
}
