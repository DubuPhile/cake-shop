import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const category = req.query.category?.toString();
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {},
          category
            ? {
                category,
              }
            : {},
        ],
      },
      include: {
        sizes: true,
        review: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const productsWithRating = products.map((product) => {
      const total = product.review.reduce((sum, r) => sum + r.rating, 0);

      const average = product.review.length ? total / product.review.length : 0;

      return {
        ...product,
        rating: average,
        reviewCount: product.review.length,
      };
    });

    res.status(200).json(productsWithRating);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to Get Products" });
  }
};
