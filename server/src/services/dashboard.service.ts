import { DashboardRepo } from "../repositories/dashboard.repository";
import { OrderRepo } from "../repositories/order.repository";

export const DashboardService = {
  getDashboardStats: async () => {
    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const endOfLastMonth = startOfThisMonth;

    const endOfThisMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
    );

    const [totalUsers, usersThisMonth, usersLastMonth] = await Promise.all([
      DashboardRepo.getTotalUsers(),
      DashboardRepo.getUsersThisMonth(startOfThisMonth),
      DashboardRepo.getUsersLastMonth(startOfLastMonth, endOfLastMonth),
    ]);

    const userGrowthPercentage =
      usersLastMonth === 0
        ? usersThisMonth > 0
          ? 100
          : 0
        : Number(
            (
              ((usersThisMonth - usersLastMonth) / usersLastMonth) *
              100
            ).toFixed(2),
          );
    const pendingOrders = await OrderRepo.getOrderCountByStatus("PENDING");

    const [
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      thisMonthSales,
      lastMonthSales,
    ] = await Promise.all([
      OrderRepo.getOrderCountByStatus(),
      DashboardRepo.getOrderThisMonth(startOfThisMonth),
      DashboardRepo.getOrderLastMonth(startOfThisMonth, endOfLastMonth),
      DashboardRepo.getMonthlySales(startOfThisMonth, endOfThisMonth),
      DashboardRepo.getMonthlySales(startOfLastMonth, endOfLastMonth),
    ]);

    const ordersGrowthPercentage =
      ordersLastMonth === 0
        ? ordersThisMonth > 0
          ? 100
          : 0
        : Number(
            (
              ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) *
              100
            ).toFixed(2),
          );

    const salesThisMonth = thisMonthSales._sum.totalAmount?.toNumber() ?? 0;
    const salesLastMonth = lastMonthSales._sum.totalAmount?.toNumber() ?? 0;

    const salesGrowth =
      lastMonthSales._sum.totalAmount === null
        ? salesThisMonth > 0
          ? 100
          : 0
        : Number(
            (
              ((salesThisMonth - salesLastMonth) / salesLastMonth) *
              100
            ).toFixed(2),
          );

    return {
      totalUsers,
      userGrowthPercentage,
      totalOrders,
      ordersGrowthPercentage,
      pendingOrders,
      monthlySales: salesThisMonth,
      salesGrowth,
    };
  },
};
