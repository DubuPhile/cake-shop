import { prisma } from "../../lib/prisma";
import { ImageUrl } from "../types/product.types";
import { PromoBanner } from "../types/promotional.types";

export const PromotionBannerRepo = {
  createBanner: async (files: ImageUrl[], payload: PromoBanner) => {
    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payload.duration);
    return prisma.promotionBanner.create({
      data: {
        title: payload.title,
        description: payload.description,
        offsetY: payload.offsetY,
        startDate,
        endDate,
        image: {
          create: files.map((imgUrl, index) => ({
            url: imgUrl.url,
            path: imgUrl.filepath,
            isPrimary: index === 0,
          })),
        },
      },
    });
  },

  getBanners: async () => {
    return prisma.promotionBanner.findMany({
      include: {
        image: true,
      },
    });
  },
};
