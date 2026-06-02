import { api } from "@/redux/state/api";

export type ProductSize = {
  id: string;
  size: string;
  price: number;
  stock: number;
  productId?: string;
};
export interface ProductStock {
  data: ProductSize[];
  success: boolean;
  message: string;
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
  price: number;
  stock?: number;
};

type Images = {
  url: string;
  isPrimary: Boolean;
};

export interface CreateProduct {
  name: string;
  category: string;
  description: string;
  sizes: sizes[];
  images: File[];
}

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
    getProductStock: builder.query<ProductStock, string>({
      query: (params) => ({
        url: `/product/getStock/${params}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    updateStocks: builder.mutation<ProductStock, ProductSize[]>({
      query: (sizes) => ({
        url: "/product/updateStock",
        method: "POST",
        body: sizes,
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useGetProductStockQuery,
  useUpdateStocksMutation,
} = ProductSlice;
