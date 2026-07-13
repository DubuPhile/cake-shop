import { DashboardRepo } from "../repositories/dashboard.repository";

export const DashboardService = {
  getDashboardStats: async () => {
    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const endOfLastMonth = startOfThisMonth;

    const [totalUsers, usersThisMonth, usersLastMonth] = await Promise.all([
      DashboardRepo.getTotalUsers(),
      DashboardRepo.getUsersThisMonth(startOfThisMonth),
      DashboardRepo.getUsersLastMonth(startOfLastMonth, endOfLastMonth),
    ]);

    const growthPercentage =
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

    return {
      totalUsers,
      growthPercentage,
    };
  },
};
