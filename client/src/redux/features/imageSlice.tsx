import { api } from "../state/api";

export const imageSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    addImage: builder.mutation<void, FormData>({
      query: (data) => ({
        url: `/image/${data.get("id")}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useAddImageMutation, useDeleteImageMutation } = imageSlice;
