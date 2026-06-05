import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";

type RateProd = {
  rating: string;
  comment: string;
};

export const RateProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { Id } = req.params;
    const { rating, comment } = req.body as RateProd;
    if (!req.user) throw Error("Unauthorized");

    const userId = req.user.id;

    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });
    console.log(userId);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }
    const product = await prisma.product.findUnique({
      where: {
        id: Id as string,
      },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found!" });
      return;
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.userId,
        productId: product.id,
        parentId: null,
      },
    });

    if (existingReview) {
      res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
      return;
    }

    const reviewData = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment: comment,
        user: { connect: { userId: user.userId } },
        product: { connect: { id: product.id } },
      },
    });

    // Update averageRating Product
    const stats = await prisma.review.aggregate({
      where: {
        productId: product.id,
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
        id: product.id,
      },
      data: {
        averageRating: stats._avg.rating ?? 0,
        reviewCount: stats._count.rating,
      },
    });
    console.log(reviewData);

    res
      .status(200)
      .json({ message: "Review Created!", success: true, data: reviewData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Rate Product Error!" });
  }
};

export const rateProductReplies = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { parentId } = req.params;
    const { comment } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        userId: userId as string,
      },
    });
    if (!user) {
      res.status(404).json({ message: "UserId not found." });
      return;
    }

    const parentReview = await prisma.review.findUnique({
      where: {
        id: parentId as string,
        parentId: null,
      },
    });
    if (!parentReview) {
      res.status(404).json({ message: "ParentId not found." });
      return;
    }

    const replies = await prisma.review.create({
      data: {
        parent: { connect: { id: parentReview.id } },
        comment: comment,
        product: { connect: { id: parentReview.productId } },
        user: { connect: { userId: user.userId } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Replies to Comment Success!",
      data: replies,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "rate Product Replies Error" });
  }
};
