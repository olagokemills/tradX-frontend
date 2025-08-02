export interface CreateAuditReportPayload {
  organizationId: string | number;
  reportNumber: string;
  reportDate: string;
  entity: string | number;
  overallRating: string;
  otherUniqueIdentifier: string;
  quarter: string;
  auditName: string;
  auditYear: string;
  summaryScope: string;
  department: string;
}

export interface FreezeAuditReportPayload {
  auditReportId: string;
  organizationId: string;
  freezeReport: boolean;
}

export interface BookmarkAuditReportPayload {
  auditReportId: string;
  organizationId: string;
  bookmark: boolean;
}

export interface AuditReport {
  auditReportId: string;
  organizationId: string;
  reportNumber: string;
  reportDate: string;
  entity: string;
  overallRating: string;
  otherUniqueIdentifier: string;
  quarter: string;
  auditName: string;
  auditYear: string;
  summaryScope: string;
  country: string;
  findingCount: number | null;
  department: string;
  createdBy: string;
  dateCreated: string;
  bookmarked: boolean;
  freezeReport: boolean;
}

export interface AuditReportResponse {
  data: AuditReport[];
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
