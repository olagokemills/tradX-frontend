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
