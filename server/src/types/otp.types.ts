export type OtpPurpose =
  | "VERIFY_EMAIL"
  | "RESET_PASSWORD"
  | "LOGIN"
  | "CHANGE_PASSWORD";

export interface OTPRequest extends Request {
  email: string;
  name?: string;
  password?: string;
  purpose: OtpPurpose;
}

export type createdOtp = {
  email: string;
  purpose: OtpPurpose;
  id: string;
};

export interface Otp {
  createdOtp: createdOtp;
}

export interface VerifyAccounts {
  email: string;
  name?: string;
  password?: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
}
