import { api } from "@/redux/state/api";

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const AdminAuthSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], string | void>({
      query: (search) => ({
        url: "/admin/get-user",
        params: search ? { search } : {},
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = AdminAuthSlice;
