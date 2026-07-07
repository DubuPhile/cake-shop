import { prisma } from "../../lib/prisma";
import {
  ImageUrl,
  RateProd,
  ReviewData,
  ReviewLikes,
} from "../types/product.types";

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

  existingReview: async (
    userId: string,
    productId: string,
  ): Promise<ReviewData | null> => {
    return prisma.review.findFirst({
      where: {
        userId,
        productId,
        parentId: null,
      },
    });
  },

  createReview: async (
    userId: string,
    productId: string,
    payload: RateProd,
    imageUrls?: ImageUrl[],
  ): Promise<ReviewData> => {
    return prisma.review.create({
      data: {
        rating: Number(payload.rating),
        comment: payload.comment,
        user: { connect: { userId } },
        product: { connect: { id: productId } },
        ...(imageUrls?.length
          ? {
              images: {
                create: imageUrls.map((imgUrl) => ({
                  url: imgUrl.url,
                  path: imgUrl.filepath,
                })),
              },
            }
          : {}),
      },
    });
  },

  updateAvgRating: async (productId: string) => {
    const stats = await prisma.review.aggregate({
      where: {
        productId,
        parentId: null,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        averageRating: stats._avg.rating ?? 0,
        reviewCount: stats._count.rating,
      },
    });
    return stats;
  },
  findParentById: async (parentId: string): Promise<ReviewData | null> => {
    return prisma.review.findUnique({
      where: {
        id: parentId,
        parentId: null,
      },
    });
  },

  createReply: async (
    comment: string,
    parentId: string,
    productId: string,
    userId: string,
  ): Promise<ReviewData> => {
    return prisma.review.create({
      data: {
        parent: { connect: { id: parentId } },
        comment: comment,
        product: { connect: { id: productId } },
        user: { connect: { userId } },
      },
    });
  },
};
