import { prisma } from "../../lib/prisma";

export const MonthlyStatsRepo = {
  latestMonthlyStat: async (month: number, year: number) => {
    return prisma.monthlyStats.findFirst({
      where: {
        month,
        year,
      },
    });
  },
  latestStats: async () => {
    return prisma.monthlyStats.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  monthlyStats: async () => {
    return prisma.monthlyStats.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  },
};
