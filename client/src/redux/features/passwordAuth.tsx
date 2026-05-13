import { api } from "../state/api";

export interface ResetPwd {
  email: string;
  newPwd: string;
}

export const PasswordAuthSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    resetPwdOtp: builder.mutation({
      query: (email: string) => ({
        url: "/pwd/resetPwdOtp",
        method: "POST",
        body: { email },
      }),
    }),
    resetPwd: builder.mutation({
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
