import { api } from "@/redux/state/api";

export type Images = {
  id?: string;
  url: string;
  isPrimary: Boolean;
};

export type ProductSize = {
  id?: string;
  size: string;
  price: number;
  stock?: number;
  productId?: string;
  product?: Products;
};
export interface ProductStock {
  data: ProductSize[];
  success: boolean;
  message?: string;
}

export type User = {
  id?: string;
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
  user: User;
  replies?: Replies[];
  likes?: Likes[];
  createdAt?: string | Date;
}
type Likes = {
  id: string;
  userId: string;
  reviewId: string;
};

export interface Products {
  id: string;
  name: string;
  category: string;
  description: string;
  images?: Images[];
  averageRating?: number;
  sizes?: ProductSize[];
  reviews?: ProductReview[];
  createdAt?: string | Date;
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

    getAllStock: builder.query<ProductStock, ProductQueryParams | void>({
      query: (params) => ({
        url: "/product/getAllStock",
        method: "GET",
        params: {
          search: params?.search,
        },
      }),
      providesTags: ["STOCKS"],
    }),
    getCategory: builder.query<string[], void>({
      query: () => ({
        url: "/product/category",
        method: "GET",
      }),
      providesTags: ["Categories"],
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
      invalidatesTags: ["Products", "Categories"],
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
      invalidatesTags: ["STOCKS"],
    }),
    updateProductDetails: builder.mutation<void, Products>({
      query: (changeData) => ({
        url: `/product/${changeData.id}`,
        method: "PATCH",
        body: { ...changeData },
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    deleteSize: builder.mutation<void, string>({
      query: (Id) => ({
        url: `/product/${Id}/size`,
        method: "DELETE",
      }),
      invalidatesTags: ["STOCKS"],
    }),
    addSize: builder.mutation<void, ProductSize>({
      query: (data) => ({
        url: `/product/addSize`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["STOCKS"],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetAllProductsQuery,
  useGetAllStockQuery,
  useCreateProductMutation,
  useGetProductStockQuery,
  useUpdateStocksMutation,
  useDeleteProductMutation,
  useDeleteSizeMutation,
  useGetProductInfoQuery,
  useUpdateProductDetailsMutation,
  useAddSizeMutation,
} = ProductSlice;
