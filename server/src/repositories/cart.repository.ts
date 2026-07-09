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
  getCart: async (userId: string) => {
    return await prisma.cartModel.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        size: true,
      },
    });
  },
  getCartById: async (cartId: string) => {
    return await prisma.cartModel.findUnique({ where: { id: cartId } });
  },
  deleteCart: async (cartId: string) => {
    return await prisma.cartModel.delete({ where: { id: cartId } });
  },
};
