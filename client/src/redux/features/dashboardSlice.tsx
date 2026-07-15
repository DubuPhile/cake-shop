import { api } from "@/redux/state/api";

export type Stats = {
  totalUsers: number;
  usersGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalSales: number;
  salesGrowth: number;
  month?: number;
  year?: number;
  createdAt: Date;
};

export interface Dashboard {
  stats: Stats;
  totalUsers: number;
}

export const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getLatestStats: builder.query<Dashboard, void>({
      query: () => ({
        url: "/api/dashboard/stats",
      }),
      providesTags: ["DASHBOARD"],
    }),
    getMonthlyStats: builder.query<Stats[], void>({
      query: () => ({
        url: "/api/dashboard/monthly",
      }),
      providesTags: ["DASHBOARD"],
    }),
  }),
});

export const { useGetLatestStatsQuery, useGetMonthlyStatsQuery } =
  dashboardSlice;
