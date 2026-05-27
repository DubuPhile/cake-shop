import { api } from "@/redux/state/api";

export interface ProductSize {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface Products {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  sizes: ProductSize[];
}

export const ProductSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Products[], string | void>({
      query: (search) => ({
        url: "/product/getAll",
        method: "GET",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetAllProductsQuery } = ProductSlice;
