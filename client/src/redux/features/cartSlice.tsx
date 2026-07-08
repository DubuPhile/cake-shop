import { api } from "@/redux/state/api";
import { Products, ProductSize } from "./product";

export type CreatedCart = {
  productId: string;
  sizeId: string;
  quantity: number;
  message?: string;
};
export type MyCart = {
  id?: string;
  product: Products;
  size: ProductSize;
  message: string;
  quantity: number;
};

export const CartSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation<void, CreatedCart>({
      query: (body) => ({
        url: "/cart/create",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["CARTS"],
    }),
    getCart: builder.query<MyCart[], void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["CARTS"],
    }),
  }),
});

export const { useAddToCartMutation, useGetCartQuery } = CartSlice;
