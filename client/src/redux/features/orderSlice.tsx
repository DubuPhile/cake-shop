import { api } from "@/redux/state/api";

type CartIds = {
  cartItemIds: (string | undefined)[];
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
  }),
});

export const { useCreateOrderMutation } = OrderSlice;
