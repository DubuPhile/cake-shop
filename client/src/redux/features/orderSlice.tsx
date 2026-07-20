import { api } from "@/redux/state/api";
import { NumberOfItems } from "./product";

type CartIds = {
  cartItemIds: (string | undefined)[];
};

export type Status =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

type CountByStatus = {
  status: Status;

  value: number;
  color: string;
};

type RecentOrders = {
  id?: string;
  orderId: string;
  customer: string;
  total: number;
  status: Status;
  date: Date;
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
    getRecentOrders: builder.query<RecentOrders[], NumberOfItems | void>({
      query: (params) => ({
        url: "/order/recent-orders",
        method: "GET",
        params: { take: params?.take },
      }),
      providesTags: ["ORDERS"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetCountByStatusQuery,
  useGetRecentOrdersQuery,
} = OrderSlice;
