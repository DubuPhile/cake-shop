import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";
import { bucket } from "../config/firebase";

export const toggleReviewLike = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { reviewId } = req.params;

    if (!reviewId) {
      res.status(400).json({ message: "Review ID not Found" });
      return;
    }

    const reviewIdString = reviewId.toString();

    const existingLike = await prisma.reviewLikes.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId: reviewIdString,
        },
      },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.reviewLikes.delete({
          where: {
            id: existingLike.id,
          },
        }),

        prisma.review.update({
          where: { id: reviewId.toString() },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      res.json({
        liked: false,
      });
      return;
    }

    await prisma.$transaction([
      prisma.reviewLikes.create({
        data: {
          userId,
          reviewId: reviewIdString,
        },
      }),

      prisma.review.update({
        where: { id: reviewIdString },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ]);

    res.status(200).json({
      liked: true,
    });
  } catch (err) {
    console.log(err);
  }
};
