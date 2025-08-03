
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuartersResponse, DepartmentResponse } from 'src/app/shared/models/reference.model';

interface FindingCategoriesResponse {
  data: string[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

interface ClosureTypesResponse {
  data: string[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  baseUrl: string = 'https://lab386.com.ng/api/v1/';
  constructor(private http: HttpClient) { }

  getQuarters(): Observable<QuartersResponse> {
    return this.http.get<QuartersResponse>(`${this.baseUrl}reference-data/quarters`);
  }

  getDepartments(): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(`${this.baseUrl}reference-data/departments`);
  }

  getFindingCategories(): Observable<FindingCategoriesResponse> {
    return this.http.get<FindingCategoriesResponse>(`${this.baseUrl}reference-data/finding-categories`);
  }

  getClosureTypes(): Observable<ClosureTypesResponse> {
    return this.http.get<ClosureTypesResponse>(`${this.baseUrl}reference-data/closure-types`);
  }
}
