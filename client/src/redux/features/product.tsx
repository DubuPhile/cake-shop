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
  createdAt: Date;
  likes?: Likes[];
  likesCount?: number;
}

export interface ProductReview {
  id?: string;
  rating: number;
  comment: string;
  user: User;
  replies?: Replies[];
  likes?: Likes[];
  images?: ReviewImage[];
  createdAt?: string | Date;
  likesCount?: number;
}

type ReviewImage = {
  id?: string;
  url: string;
};
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
  slug?: string;
  images?: Images[];
  averageRating?: number;
  sizes?: ProductSize[];
  reviews?: ProductReview[];
  createdAt?: string | Date;
}
type ProductQueryParams = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export interface CreateProduct {
  name: string;
  category: string;
  description: string;
  sizes: ProductSize[];
  images: File[];
}

type MaxPrice = {
  max: number;
};

export interface BestSellingProduct {
  productId?: string;
  productName: string;
  productImage: Images;
  totalQuantity: number;
  subTotal: number;
}

export type NumberOfItems = {
  take?: number;
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
          maxPrice: params?.maxPrice,
          minPrice: params?.minPrice,
        },
      }),
      providesTags: ["Products"],
    }),

    getMaxPrice: builder.query<MaxPrice, void>({
      query: () => ({
        url: "/product/max-price",
        method: "GET",
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
      providesTags: ["Products"],
    }),

    getProductInfo: builder.query<Products, string>({
      query: (slug) => ({
        url: `/product/${slug}`,
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
      invalidatesTags: ["STOCKS", "Products"],
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
      invalidatesTags: ["STOCKS", "Products"],
    }),
    addSize: builder.mutation<void, ProductSize>({
      query: (data) => ({
        url: `/product/addSize`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["STOCKS", "Products"],
    }),
    getBestSellingProduct: builder.query<
      BestSellingProduct[],
      NumberOfItems | void
    >({
      query: (params) => ({
        url: "/product/best-selling",
        method: "GET",
        params: { take: params?.take },
      }),
      providesTags: ["Products"],
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
  useGetMaxPriceQuery,
  useGetBestSellingProductQuery,
} = ProductSlice;
