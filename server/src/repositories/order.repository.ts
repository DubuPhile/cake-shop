import { prisma } from "../../lib/prisma";
import { CreatedCart } from "../types/cart.types";
import { OrderStatus } from "../types/order.Type";

export const OrderRepo = {
  createdOrder: async (CartItems: CreatedCart[], userId: string) => {
    return prisma.order.create({
      data: {
        userId,
        totalAmount: CartItems.reduce(
          (total, item) => total + (item.size?.price || 0) * item.quantity,
          0,
        ),
        items: {
          create: CartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.size?.price || 0,
            size: item.size?.size || "",
            subtotal: item.quantity * (item.size?.price || 0),
            message: item.message,
          })),
        },
      },
    });
  },
  getOrdersByStatus: async (status?: OrderStatus) => {
    return prisma.order.findMany({
      where: status ? { status } : {},
    });
  },

  getOrderCountByStatus: async (status?: OrderStatus) => {
    return prisma.order.count({
      where: status ? { status } : {},
    });
  },

  monthlySales: async (startOfMonth: Date, endOfMonth: Date) => {
    return prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
  },

  totalOrdersCompletedThisMonth: async (
    startOfMonth: Date,
    endOfMonth: Date,
  ) => {
    return prisma.order.count({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  },

  getBestSellingProduct: async () => {
    return prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          status: "COMPLETED",
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    });
  },
};
