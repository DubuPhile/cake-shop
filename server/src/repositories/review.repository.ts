import { prisma } from "../../lib/prisma";
import { ReviewLikes } from "../types/product.types";

export const reviewRepo = {
  checkExistLikes: async (
    userId: string,
    reviewId: string,
  ): Promise<ReviewLikes | null> => {
    return prisma.reviewLikes.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });
  },
  decreaseLikes: async (
    likesId: string,
    reviewId: string,
  ): Promise<boolean> => {
    await prisma.$transaction([
      prisma.reviewLikes.delete({
        where: {
          id: likesId,
        },
      }),

      prisma.review.update({
        where: { id: reviewId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      }),
    ]);
    return false;
  },

  increaseLikes: async (userId: string, reviewId: string): Promise<boolean> => {
    await prisma.$transaction([
      prisma.reviewLikes.create({
        data: {
          userId,
          reviewId,
        },
      }),

      prisma.review.update({
        where: { id: reviewId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return true;
  },
};
