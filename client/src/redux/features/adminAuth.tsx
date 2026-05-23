import { api } from "@/redux/state/api";

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const AdminAuthSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/admin/get-user",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = AdminAuthSlice;
