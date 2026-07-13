import { prisma } from "../../lib/prisma";

export const DashboardRepo = {
  getTotalUsers: async () => {
    return prisma.users.count();
  },

  //   getTotalOrders: async () => {
  //     return prisma.orders.count();
  //   },

  //   getTotalRevenue: async () => {
  //     const revenue = await prisma.orders.aggregate({
  //       _sum: {
  //         totalAmount: true,
  //       },
  //       where: {
  //         status: "COMPLETED",
  //       },
  //     });

  //     return revenue._sum.totalAmount || 0;
  //   },

  getUsersThisMonth: async (startDate: Date) => {
    return prisma.users.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });
  },

  getUsersLastMonth: async (startDate: Date, endDate: Date) => {
    return prisma.users.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  },
};
