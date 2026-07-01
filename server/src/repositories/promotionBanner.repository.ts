import { prisma } from "../../lib/prisma";
import { ImageUrl } from "../types/product.types";
import { PromoBanner } from "../types/promotional.types";

export const PromotionBannerRepo = {
  createBanner: async (files: ImageUrl[], payload: PromoBanner) => {
    return prisma.promotionBanner.create({
      data: {
        title: payload.title,
        description: payload.description,
        offsetY: payload.offsetY,
        startDate: payload.startDate,
        endDate: payload.endDate,
        ...(payload.link && { link: payload.link }),
        ...(payload.cta && { CTA: payload.cta }),
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
