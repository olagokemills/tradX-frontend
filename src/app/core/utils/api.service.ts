import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthPoints } from 'src/app/shared/constants/services';
import {
  BranchResponse,
  BvnResponse,
  GenericPayload,
  RequestOtpPayload,
} from 'src/app/shared/models/models.interface';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '';
  private metamapUrl = 'https://api.getmati.com/v2/';
  private cevaUrl =
    'https://firstmonieagent.firstbanknigeria.com/serviceapi/api/signup/';
  API_TIMEOUT = 350000;
  constructor(private http: HttpClient) {
    const host = window.location.host;
    if (host.includes('localhost')) {
      this.baseUrl =
        'https://openaccounts2.firstbanknigeria.com/DaoMerchApi/api/v1/';
    } else {
      this.baseUrl =
        'https://openaccounts2.firstbanknigeria.com/DaoMerchApi/api/v1/';
    }
  }
  private ninWrapper =
    'https://openaccounts2.firstbanknigeria.com/damapi/api/v1/verifyID';

  requestOtp(data: RequestOtpPayload) {
    return this.http.post<any>(`${this.baseUrl}${AuthPoints.AmOTP}`, data);
  }
  validateOtp(data: RequestOtpPayload) {
    return this.http.post<any>(`${this.baseUrl}${AuthPoints.AmOTP}`, data).pipe(
      timeout(this.API_TIMEOUT), // Set timeout
      catchError(this.handleError) // Handle errors
    );
  }
  verifyBusinessInfo(data: any) {
    return this.http
      .post<any>(`${this.baseUrl}${AuthPoints.verifyBusiness}`, data)
      .pipe(
        timeout(this.API_TIMEOUT), // Set timeout
        catchError(this.handleError) // Handle errors
      );
  }

  fetchBranches(data: {
    RequestID: string;
    Key: string;
  }): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(
      `${this.baseUrl}${AuthPoints.fetchBranches}`,
      data
    );
  }

  private handleError(error: any) {
    if (error instanceof TimeoutError) {
      console.error('Request timed out!');
    } else if (error instanceof HttpErrorResponse) {
      console.error('An HTTP error occurred:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }

    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
  uploadVideo(data: any, identity: string) {
    //add content  type as header

    return this.http.post<any>(
      `${this.metamapUrl}${AuthPoints.metaVideo}/${identity}/send-input`,
      data
    );
  }
  requestToken(data: any) {
    return this.http.post<any>(`${this.baseUrl}${AuthPoints.metaToken}`, data);
  }
  getIdentity(data: any) {
    return this.http.post<any>(`${this.metamapUrl}verifications`, data);
  }
  getOauth() {
    const url = 'https://api.getmati.com/oauth';
    const reqUrl = window.location.href;
    // Prepare FormData
    const body = 'grant_type=client_credentials';
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    // Set Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: reqUrl.includes('localhost')
        ? 'Basic NjM4Zjk1ODQ5MzlkNTYwMDFiNjBjOTkyOlhVVEhaWUFLQ0hLRUNNSVJRSFNQRUg2NlJZS0dGRDUy'
        : 'Basic NjI1NTk2MTliZDkzMDQwMDFjMjM4ZDA4OlFFSDAwTkhXTUs3RVQ1RFk2UkVFMUhEM0hEMzhVV04y',
      'x-mati-app': 'platform=web_desktop; version=22.2.10',
      Accept: '*/*',
    });

    // Make POST request
    return this.http.post<any>(url, body, { headers });
  }

  getFeedback(data: string) {
    return this.http.get<any>(`${this.metamapUrl}verifications/${data}`);
  }

  submitAmRequest(data: RequestOtpPayload) {
    return this.http.post<any>(`${this.baseUrl}${AuthPoints.submitAM}`, data);
  }
  checkNIN(data: any) {
    return this.http.post<any>(`${this.baseUrl}${AuthPoints.checkNIN}`, data);
  }
  checkBvn(data: any): Observable<any> {
    return this.http.post<BvnResponse>(
      `${this.baseUrl}${AuthPoints.checkBVN}`,
      data
    );
  }
  submitAoRequest(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${AuthPoints.submitAO}`, data);
  }
  fetchStates(data: GenericPayload) {
    return this.http.post<any>(`${this.baseUrl}getStates`, data);
  }
  fetchLga(data: GenericPayload) {
    return this.http.post<any>(`${this.baseUrl}getLga`, data);
  }
  fetchCity(data: GenericPayload) {
    return this.http.post<any>(`${this.baseUrl}getCity`, data);
  }
  fetchAmbassadors(): Observable<any> {
    return this.http.post<any>(`${this.cevaUrl}${AuthPoints.getAmb}`, {});
  }
  fetchFses(): Observable<any> {
    return this.http.post<any>(`${this.cevaUrl}${AuthPoints.getFses}`, {});
  }

  getNinOauth() {
    const url = 'https://api.getmati.com/oauth/token';
    const reqUrl = window.location.href;
    // Prepare FormData
    const body =
      'grant_type=client_credentials&scope=verification_flow&application_key=62559619bd9304001c238d08&flow_id=66927cf7896b07001c645d2f';

    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('scope', 'verification_flow');
    formData.append('application_key', '62559619bd9304001c238d08');
    formData.append('flow_id', '66927cf7896b07001c645d2f');
    // Set Authorization header
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: reqUrl.includes('localhost')
        ? 'Basic NjM4Zjk1ODQ5MzlkNTYwMDFiNjBjOTkyOlhVVEhaWUFLQ0hLRUNNSVJRSFNQRUg2NlJZS0dGRDUy'
        : 'Basic NjI1NTk2MTliZDkzMDQwMDFjMjM4ZDA4OlFFSDAwTkhXTUs3RVQ1RFk2UkVFMUhEM0hEMzhVV04y',
      'x-mati-app': 'platform=web_desktop; version=22.2.10',
      Accept: '*/*',
    });
    //
    // Make POST request
    return this.http.post<any>(url, body, { headers });
  }

  completeNinReq(data: any) {
    return this.http.post<any>(`${this.ninWrapper}`, data);
  }
}
