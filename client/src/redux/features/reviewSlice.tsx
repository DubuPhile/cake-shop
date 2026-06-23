import { api } from "@/redux/state/api";

export const reviewSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    toggleLikes: builder.mutation<void, string>({
      query: (id) => ({
        url: `/review/toggle/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useToggleLikesMutation } = reviewSlice;
