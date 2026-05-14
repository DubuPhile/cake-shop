import { api } from "../state/api";
import { OTPVerification } from "./OTPAuth";
import { serverResponse } from "./userAuth";

export interface ResetPwd {
  email: string;
  newPwd: string;
}

export const PasswordAuthSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    resetPwdOtp: builder.mutation<OTPVerification, string>({
      query: (email: string) => ({
        url: "/pwd/resetPwdOtp",
        method: "POST",
        body: { email },
      }),
    }),
    resetPwd: builder.mutation<serverResponse, ResetPwd>({
      query: (resetPwd) => ({
        url: "/pwd/resetPwd",
        method: "POST",
        body: { ...resetPwd },
      }),
    }),
  }),
});

export const { useResetPwdOtpMutation, useResetPwdMutation } =
  PasswordAuthSlice;
