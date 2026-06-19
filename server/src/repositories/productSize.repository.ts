import { prisma } from "../../lib/prisma";
import { Sizes } from "../types/product.types";

export const ProductSizeRepo = {
  getSizes: async (id: string) => {
    return prisma.productSize.findMany({
      where: { OR: [{ productId: id }, { id: id }] },
    });
  },
  updateProdSizes: async (sizes: Sizes[]) => {
    return prisma.$transaction(
      sizes.map((s) =>
        prisma.productSize.update({
          where: { id: s.id || "" },
          data: {
            size: s.size,
            stock: s.stock,
            price: s.price,
          },
        }),
      ),
    );
  },
  addSize: async (payload: Sizes) => {
    return prisma.productSize.create({
      data: {
        size: payload.size,
        price: payload.price,
        stock: payload.stock,
        product: { connect: { id: payload.productId || "" } },
      },
    });
  },
  deleteSize: async (id: string) => {
    return prisma.productSize.delete({
      where: { id },
    });
  },
};
