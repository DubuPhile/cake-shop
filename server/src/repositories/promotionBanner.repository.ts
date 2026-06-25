import { prisma } from "../../lib/prisma";
import { ImageUrl } from "../types/product.types";

export const PromotionBannerRepo = {
  createBanner: async (
    files: ImageUrl[],
    title: string,
    description: string,
    durationDays: number,
  ) => {
    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return prisma.promotionBanner.create({
      data: {
        title,
        description,
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
};
