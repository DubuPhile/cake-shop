import { JwtPayload } from "jsonwebtoken";
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

export interface ChangePwd {
  newPwd: string;
  currentPwd: string;
  verified: string;
}

export interface ResetPwd {
  newPwd: string;
  email: string;
}

export type UserData = {
  name: string;
  email: string;
  userId: string;
};

export type RefreshTokenPayload = JwtPayload & {
  user: string;
};

export interface RefreshToken {
  accessToken: string;
  hasLocalPassword: boolean;
}
