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
