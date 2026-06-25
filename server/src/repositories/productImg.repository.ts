import { prisma } from "../../lib/prisma";

export const imgProdRepo = {
  findImg: async (id: string) => {
    return prisma.image.findFirst({
      where: { id },
    });
  },
  delete: async (id: string) => {
    return prisma.image.delete({
      where: { id },
    });
  },
};
