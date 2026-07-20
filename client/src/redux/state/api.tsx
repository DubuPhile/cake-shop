import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
  createApi,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "@/redux/store";
import { setCredentials, logOut } from "@/redux/state/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    if (refreshResult.data) {
      const auth = (api.getState() as RootState).auth;

      api.dispatch(
        setCredentials({
          ...auth,
          accessToken: (refreshResult.data as { token: string }).token,
        }),
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "Users",
    "Products",
    "STOCKS",
    "Categories",
    "BANNER",
    "CARTS",
    "DASHBOARD",
    "ORDERS",
  ],
  endpoints: () => ({}),
});
