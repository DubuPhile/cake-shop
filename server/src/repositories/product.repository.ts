import { prisma } from "../../lib/prisma";
import { ImageUrl } from "../types/product.types";

export const productRepo = {
  //FIND PRODUCT BY ID
  findProductbyId: async (id: string) => {
    return prisma.product.findFirst({
      where: {
        id: id,
      },
    });
  },
  //ADD IMAGE
  addImage: async (id: string, imageUrls: ImageUrl[]) => {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        images: {
          create: imageUrls.map((imgUrl) => ({
            url: imgUrl.url,
            path: imgUrl.filepath,
          })),
        },
      },
    });
  },
};
