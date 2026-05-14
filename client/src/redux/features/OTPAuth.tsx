import { VerifyOTP } from "@/app/(components)/VerifyModal";
import { api } from "@/redux/state/api";
import { serverResponse } from "./userAuth";

type Purpose = "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN" | "CHANGE_PASSWORD";

export interface verifyOTP {
  purpose: Purpose;
  otpCode: number;
  email: string;
}

export interface resendOTP {
  purpose: Purpose;
  email: string;
}

export interface OTPVerification {
  message: string;
  success: boolean;
  data: VerifyOTP;
}

export const OTPAuthSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    verifyOTP: builder.mutation<serverResponse, verifyOTP>({
      query: (verify) => ({
        url: "/verifyOtp",
        method: "POST",
        body: { ...verify },
      }),
    }),
    resendOTP: builder.mutation<OTPVerification, resendOTP>({
      query: (resendOtp) => ({
        url: "/verifyOtp/resend",
        method: "POST",
        body: { ...resendOtp },
      }),
    }),
  }),
});

export const { useVerifyOTPMutation, useResendOTPMutation } = OTPAuthSlice;
