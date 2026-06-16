import { OtpPurpose } from "./otp.types";

export interface Login {
  user: string;
  pwd: string;
}

export interface Register {
  username: string;
  pwd: string;
  email: string;
}

export interface CreateAccount {
  name: string;
  password: string;
  email: string;
}

export interface VerifyOTP {
  email: string;
  purpose: OtpPurpose;
  otpCode: string;
}
