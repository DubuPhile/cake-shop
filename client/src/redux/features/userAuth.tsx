import { api } from "../state/api";

export interface credentials {
  user: string;
  pwd: string;
}

type Purpose = "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN" | "CHANGE_PASSWORD";

export interface verifyOTP {
  purpose: Purpose;
  otpCode: string;
  email: string;
}

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    verifyOTP: builder.mutation({
      query: (verify: verifyOTP) => ({
        url: "/verifyOtp",
        method: "POST",
        body: { ...verify },
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/refresh",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useVerifyOTPMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
} = authApiSlice;
