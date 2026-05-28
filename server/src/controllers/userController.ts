import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";

type RateProd = {
  rating: number;
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

    const reviewData = await prisma.review.create({
      data: {
        rating: rating,
        comment: comment,
        user: { connect: { userId: user.userId } },
        product: { connect: { id: product.id } },
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
