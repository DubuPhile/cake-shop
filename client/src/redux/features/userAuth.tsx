import { VerifyOTP } from "@/app/(components)/VerifyModal";
import { api } from "../state/api";
import { OTPVerification } from "./OTPAuth";

export interface credentials {
  user: string;
  pwd: string;
}

export interface registerData {
  email: string;
  username: string;
  pwd: string;
}

export interface serverResponse {
  message?: string;
  data?: VerifyOTP;
  accessToken?: string;
}

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<serverResponse, credentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation<OTPVerification, registerData>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: { ...data },
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
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
} = authApiSlice;
