import { api } from "@/redux/state/api";

export interface ProductSize {
  id: string;
  size: string;
  price: number;
  stock: number;
}
type User = {
  name: string;
  avatar: string;
};

export interface ProductReview {
  rating: number;
  comment: string;
  userId: User[];
}

export interface Products {
  id: string;
  name: string;
  category: string;
  description: string;
  image: Images[];
  rating: number;
  sizes: ProductSize[];
  review: ProductReview[];
}
type ProductQueryParams = {
  search?: string;
  category?: string;
};

export type sizes = {
  size: string;
  price: string;
};

type Images = {
  url: string;
  isPrimary: Boolean;
};

export const ProductSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Products[], ProductQueryParams | void>({
      query: (params) => ({
        url: "/product/getAll",
        method: "GET",
        params: {
          search: params?.search,
          category: params?.category,
        },
      }),
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation<void, FormData>({
      query: (productData) => ({
        url: "/product/create",
        method: "POST",
        body: productData,
      }),
    }),
  }),
});

export const { useGetAllProductsQuery, useCreateProductMutation } =
  ProductSlice;
