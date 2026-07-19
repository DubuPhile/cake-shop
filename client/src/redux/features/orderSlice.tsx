import { api } from "@/redux/state/api";

type CartIds = {
  cartItemIds: (string | undefined)[];
};

type CountByStatus = {
  status:
    | "PENDING"
    | "PAID"
    | "PROCESSING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  value: number;
  color: string;
};

export const OrderSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<void, CartIds>({
      query: (CartIds) => ({
        url: "/order/create",
        method: "POST",
        body: { ...CartIds },
      }),
      invalidatesTags: ["CARTS"],
    }),
    getCountByStatus: builder.query<CountByStatus[], void>({
      query: () => ({
        url: "/order/count-by-status",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetCountByStatusQuery } = OrderSlice;
