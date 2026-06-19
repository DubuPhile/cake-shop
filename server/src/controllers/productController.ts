import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../middleware/verifyJWT";
import { productRepo } from "../repositories/product.repository";
import { ProductService } from "../services/product.service";
import { NewProductData, Sizes } from "../types/product.types";
import { ProductSizeRepo } from "../repositories/productSize.repository";

export const getCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await productRepo.getCategory();
    const category = result.map((p) => p.category);
    console.log(category);
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR GET CATEGORY" });
  }
};
/** GET ALL PRODUCTS */
export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const category = req.query.category?.toString();
    const products = await productRepo.getAllProductWithSearch(
      search,
      category,
    );

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to Get Products" });
  }
};

/** GET PRODUCT INFO */
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

    const product = await productRepo.getProduct(id.toString());

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error Server in getProductInfo" });
  }
};

/** CREATE PRODUCT */
export const createProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const payload = req.body as NewProductData;
    const files = (req.files as Express.Multer.File[]) || [];

    if (!userId) throw new Error("Unauthorized");
    if (!files || files.length === 0) {
      res.status(400).json({
        message: "No images uploaded",
      });
      return;
    }
    const data = await ProductService.createProduct(userId, payload, files);
    res.status(201).json({
      success: true,
      message: "Product created Successfully!",
      data: data,
    });
  } catch (err: any) {
    console.log(err);
    if (err.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }
    res.status(500).json({ message: "Error create Product server!" });
  }
};

/** GET PRODUCT STOCKS */
export const getProductStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Invalid product id",
      });
      return;
    }
    const stock = await ProductSizeRepo.getSizes(id.toString());
    if (stock.length === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
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

/** UPDATE STOCK */
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

    const sizes = req.body as Sizes[];
    if (sizes.length === 0 || !sizes) {
      res.status(400).json({ message: "Invalid Sizes" });
    }
    const data = await ProductSizeRepo.updateProdSizes(sizes);
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

/** ADD SIZE */
export const addSize = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const payload = req.body as Sizes;
    if (
      !payload.size ||
      !payload.price ||
      !payload.stock ||
      !payload.productId
    ) {
      res.status(400).json({ message: "Size, price, stock is Required" });
    }

    const newSize = await ProductSizeRepo.addSize(payload);

    res
      .status(201)
      .json({ success: true, message: "Add size successfull!", data: newSize });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Server AddSize" });
  }
};

/** DELETE SIZE */
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
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Invalid sizeId" });
      return;
    }

    await ProductSizeRepo.deleteSize(id.toString());

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Server DeleteSize" });
  }
};

/** DELETE PRODUCT */
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
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Invalid Id" });
      return;
    }

    const deletedProduct = await ProductService.deleteProduct(id.toString());

    console.log(deletedProduct);

    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025" || err.message === "PRODUCT_NOT_FOUND") {
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

export const getAllStocks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const stock = await prisma.productSize.findMany({
      where: {
        product: search
          ? { name: { contains: search, mode: "insensitive" } }
          : {},
      },
      orderBy: {
        product: {
          name: "asc",
        },
      },
      include: {
        product: true,
      },
    });

    res.status(200).json({ success: true, data: stock });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
