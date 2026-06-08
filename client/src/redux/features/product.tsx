import { api } from "@/redux/state/api";

type Images = {
  url: string;
  isPrimary: Boolean;
};

export type ProductSize = {
  id?: string;
  size: string;
  price: number;
  stock?: number;
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

export interface Replies {
  id?: string;
  comment: string;
  parentId: string;
  user: User;
}

export interface ProductReview {
  id?: string;
  rating: number;
  comment: string;
  user: User[];
  replies?: Replies[];
}

export interface Products {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: Images[];
  averageRating?: number;
  sizes?: ProductSize[];
  review?: ProductReview[];
}
type ProductQueryParams = {
  search?: string;
  category?: string;
};

export interface CreateProduct {
  name: string;
  category: string;
  description: string;
  sizes: ProductSize[];
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
    getProductInfo: builder.query<Products, string>({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "GET",
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
    updateProductDetails: builder.mutation<void, Products>({
      query: (changeData) => ({
        url: `/product/${changeData.id}`,
        method: "PATCH",
        body: { ...changeData },
      }),
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useGetProductStockQuery,
  useUpdateStocksMutation,
  useDeleteProductMutation,
  useGetProductInfoQuery,
  useUpdateProductDetailsMutation,
} = ProductSlice;
