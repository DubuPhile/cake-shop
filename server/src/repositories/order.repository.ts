import { prisma } from "../../lib/prisma";
import { CreatedCart } from "../types/cart.types";
import { ORDER_STATUSES, OrderStatus } from "../types/order.Type";

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

  getOrderStatusTotal: async () => {
    const result = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });
    const ORDER_STATUS_COLORS = {
      PENDING: "#FACC15",
      PAID: "#3B82F6",
      PROCESSING: "#A855F7",
      READY: "#06B6D4",
      COMPLETED: "#22C55E",
      CANCELLED: "#EF4444",
    } as const;
    return ORDER_STATUSES.map((status) => ({
      status: status.replace("_", " "),
      value: result.find((item) => item.status === status)?._count.status ?? 0,
      color: ORDER_STATUS_COLORS[status],
    }));
  },

  getBestSellingProduct: async (take?: number) => {
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
      ...(take && { take }),
    });
  },

  getRecentOrders: async (take?: number) => {
    return prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(take && { take }),
    });
  },
};
