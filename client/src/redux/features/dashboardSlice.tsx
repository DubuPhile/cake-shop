import { api } from "@/redux/state/api";

export interface Stats {
  totalUsers: string;
  userGrowthPercentage: number;
  totalOrders: string;
  ordersGrowthPercentage: number;
  pendingOrders: number;
  monthlySales: number;
  salesGrowth: number;
}

export const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<Stats, void>({
      query: () => ({
        url: "/api/dashboard/stats",
      }),
      providesTags: ["DASHBOARD"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardSlice;
