export interface ValidateOtpPayload {
  emailAddress: string;
  otp: string;
}

export interface ValidateOtpResponse {
  data: {
    userId: string;
    message: string;
  };
  errorMessage: string;
  responseMessage: string;
  responseCode: number;
  isSuccess: boolean;
}
