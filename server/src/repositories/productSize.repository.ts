import { prisma } from "../../lib/prisma";
import { Sizes } from "../types/product.types";

export const ProductSizeRepo = {
  getSizes: async (id: string) => {
    return prisma.productSize.findMany({
      where: { OR: [{ productId: id }, { id: id }] },
    });
  },
  getSizeById: async (id: string) => {
    return prisma.productSize.findFirst({
      where: { id },
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

  getAllSizeWithSearch: async (search?: string) => {
    return prisma.productSize.findMany({
      where: {
        product: search
          ? { name: { contains: search, mode: "insensitive" } }
          : {},
      },
      orderBy: {
        product: {
          name: "asc",
        },
      },
      include: {
        product: true,
      },
    });
  },

  getLowStockProducts: async (take?: number) => {
    return prisma.productSize.findMany({
      ...(take && { take }),
      orderBy: {
        stock: "asc",
      },
      where: {
        stock: {
          lte: 2,
        },
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                isPrimary: true,
              },
            },
          },
        },
      },
    });
  },
};
