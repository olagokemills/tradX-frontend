export interface QuartersResponse {
  data: string[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  baseUrl: string = 'https://lab386.com.ng/api/v1/';
  constructor(private http: HttpClient) { }

  getQuarters(): Observable<QuartersResponse> {
    return this.http.get<QuartersResponse>(`${this.baseUrl}reference-data/quarters`);
  }
}
