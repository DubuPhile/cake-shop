import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";
import { bucket } from "../config/firebase";

//GET ALL PRODUCTS
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
      orderBy: { name: "asc" },
      include: {
        sizes: true,
        images: true,
        reviews: {
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

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to Get Products" });
  }
};

//GET PRODUCT INFO
export const getProductInfo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Invalid" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id.toString(),
      },
      include: {
        sizes: true,
        images: true,
        reviews: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                userId: true,
                name: true,
                avatar: true,
              },
            },
            replies: {
              orderBy: {
                createdAt: "asc",
              },
              include: {
                user: {
                  select: {
                    userId: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error Server in getProductInfo" });
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

//CREATE PRODUCT
export const createProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, category, description, sizes } = req.body as ProductData;
    const files = (req.files as Express.Multer.File[]) || [];

    if (!userId) throw new Error("Unauthorized");
    const foundUser = await prisma.users.findFirst({
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
        const fileName = `Products/${name}/${Date.now()}-${file.originalname}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
          public: true,
        });

        return {
          url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          filepath: fileName,
        };
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
        images: {
          create: imageUrls.map((imgUrl, index) => ({
            url: imgUrl.url,
            path: imgUrl.filepath,
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

//GET PRODUCT STOCKS
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
  size: string;
  price: number;
  stock: number;
};

// UPDATE PRODUCT STOCKS
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
            size: s.size,
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

//DELETE SIZE
export const deleteSize = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { Id } = req.params;
    if (!Id) {
      res.status(400).json({ message: "Invalid sizeId" });
      return;
    }

    await prisma.productSize.delete({
      where: {
        id: Id.toString(),
      },
    });

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Server DeleteSize" });
  }
};

//DELETE PRODUCT
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { Id } = req.params;
    if (!Id) {
      res.status(400).json({ message: "Invalid Id" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: Id.toString(),
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    await Promise.all(
      product.images.map(async (img) => {
        if (img.path) {
          await bucket.file(img.path).delete();
        } else {
          const encodedPath = img.url.split("/o/")[1];
          if (!encodedPath) {
            throw new Error("Invalid Firebase URL");
          }
          const filePath = decodeURIComponent(encodedPath.split("?")[0] ?? "");
          await bucket.file(filePath).delete();
        }
      }),
    );

    const deletedProduct = await prisma.product.delete({
      where: {
        id: Id.toString(),
      },
    });

    console.log(deletedProduct);

    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    console.log(err);
    res.status(500).json({ success: false, message: "Delete Product Error" });
  }
};

interface ProductParams {
  productId: string;
}

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, description, category } = req.body;
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({ message: "Forbidden" });
      return;
    }

    if (!name || !description || !category) {
      res
        .status(400)
        .json({ message: "Name, Description and Category is Required." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId.toString(),
      },
      data: {
        name: name,
        description: description,
        category: category,
      },
    });

    res.status(200).json({ message: "Product Updated!", data: updatedProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid Server updateProduct." });
  }
};
