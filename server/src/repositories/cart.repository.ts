import { prisma } from "../../lib/prisma";
import { CartItem, CreatedCart } from "../types/cart.types";

export const CartRepo = {
  createCart: async (
    userId: string,
    payload: CartItem,
  ): Promise<CreatedCart> => {
    return await prisma.cartModel.create({
      data: {
        userId,
        productId: payload.productId,
        sizeId: payload.sizeId,
        quantity: payload.quantity,
        ...(payload.message && { message: payload.message }),
      },
    });
  },
};
