import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";
import { bucket } from "../config/firebase";

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
        image: true,
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

type ProductData = {
  name: string;
  category: string;
  description: string;
  images: [
    {
      url: string;
    },
  ];
  sizes: Sizes[];
};

type Sizes = {
  price: number;
  size: string;
  stock: number;
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, category, description, sizes } = req.body as ProductData;
    const files = (req.files as Express.Multer.File[]) || [];

    if (!userId) throw new Error("Unauthorized");
    const foundUser = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!foundUser) throw new Error("User not found");
    if (!files || files.length === 0) {
      res.status(400).json({
        message: "No images uploaded",
      });
      return;
    }

    const imageUrls = await Promise.all(
      files.map(async (file, index) => {
        const fileName = `Products/${name}/${Date.now()}-${file.originalname}${index}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
          public: true,
        });

        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      }),
    );

    const data = await prisma.product.create({
      data: {
        name: name,
        category: category,
        description: description,
        sizes: {
          create: sizes.map((sizes) => ({
            size: sizes.size,
            stock: sizes.stock || 0,
            price: Number(sizes.price),
          })),
        },
        image: {
          create: imageUrls.map((url, index) => ({
            url,
            isPrimary: index === 0,
          })),
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "Product created Successfully!",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error create Product server!" });
  }
};

interface ProductParams {
  id: string;
}

export const getProductStock = async (
  req: Request<ProductParams>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      res.status(400).json({
        message: "Invalid product id",
      });
      return;
    }
    const stock = await prisma.productSize.findMany({
      where: {
        productId: id,
      },
    });
    if (stock.length === 0 || !stock) {
      res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, data: stock, message: "Product stocks!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error Server getProductStock" });
  }
};

type UpdateStock = {
  id: string;
  price: number;
  stock: number;
};

export const updateStocks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const sizes = req.body as UpdateStock[];
    if (sizes.length === 0 || !sizes) {
      res.status(400).json({ message: "Invalid Sizes" });
    }
    const data = await prisma.$transaction(
      sizes.map((s) =>
        prisma.productSize.update({
          where: { id: s.id },
          data: {
            stock: s.stock,
            price: s.price,
          },
        }),
      ),
    );
    res
      .status(200)
      .json({ success: true, data: data, message: "Update Stock Success!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error updateStock server" });
  }
};
