import { prisma } from "../../lib/prisma";
import { CreatedCart } from "../types/cart.types";

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
            message: item.message,
          })),
        },
      },
    });
  },
};
