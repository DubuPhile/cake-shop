import { prisma } from "../../lib/prisma";

export const DashboardRepo = {
  getTotalUsers: async () => {
    return prisma.users.count();
  },

  getTotalOrders: async () => {
    return prisma.order.count();
  },

  getTotalRevenue: async () => {
    const revenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: "COMPLETED",
      },
    });

    return revenue._sum.totalAmount || 0;
  },

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

  getOrderThisMonth: async (startDate: Date) => {
    return prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });
  },

  getOrderLastMonth: async (startDate: Date, endDate: Date) => {
    return prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  },

  getMonthlySales: async (startDate: Date, endDate: Date) => {
    return prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
  },
};
