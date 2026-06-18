import { prisma } from "../../lib/prisma";

export const imgProdRepo = {
  findImg: async (id: string) => {
    return prisma.productImage.findFirst({
      where: { id },
    });
  },
  delete: async (id: string) => {
    return prisma.productImage.delete({
      where: { id },
    });
  },
};
