export interface Department {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  data: Department[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
export interface QuartersResponse {
  data: string[];
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
