import { api } from "@/redux/state/api";

export type BannerForm = {
  title: string;
  description: string;
  CTA: string;
  startDate: Date | null;
  endDate: Date | null;
  link?: string;
  image?: image[];
  offsetY?: number;
};
type image = {
  url: string;
};

export const BannerSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getBanner: builder.query<BannerForm[], void>({
      query: () => ({
        url: "/promo",
        method: "GET",
      }),
      providesTags: ["BANNER"],
    }),
    createBanner: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/promo/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["BANNER"],
    }),
  }),
});

export const { useCreateBannerMutation, useGetBannerQuery } = BannerSlice;
