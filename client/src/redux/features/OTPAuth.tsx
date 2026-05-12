import { api } from "../state/api";

type Purpose = "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN" | "CHANGE_PASSWORD";

export interface verifyOTP {
  purpose: Purpose;
  otpCode: string;
  email: string;
}

export interface resendOTP {
  purpose: Purpose;
  email: string;
}

export const OTPAuthSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    verifyOTP: builder.mutation({
      query: (verify: verifyOTP) => ({
        url: "/verifyOtp",
        method: "POST",
        body: { ...verify },
      }),
    }),
    resendOTP: builder.mutation({
      query: (resendOtp: resendOTP) => ({
        url: "/verifyOtp/resend",
        method: "POST",
        body: { ...resendOtp },
      }),
    }),
  }),
});

export const { useVerifyOTPMutation, useResendOTPMutation } = OTPAuthSlice;
