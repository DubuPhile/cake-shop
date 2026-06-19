import { bucket } from "../config/firebase";
import { productRepo } from "../repositories/product.repository";
import { UserRepo } from "../repositories/user.repository";
import { NewProductData, ProductData } from "../types/product.types";
import { ProductImageService } from "./productImage.service";

export const ProductService = {
  createProduct: async (
    userId: string,
    payload: NewProductData,
    files: Express.Multer.File[],
  ): Promise<ProductData> => {
    const foundUser = await UserRepo.findbyId(userId);
    if (!foundUser) throw new Error("USER_NOT_FOUND");
    const imageUrls = await ProductImageService.uploadImage(
      files,
      payload.name,
    );

    const data = await productRepo.createProduct(payload, imageUrls);

    return data;
  },

  deleteProduct: async (id: string) => {
    const product = await productRepo.getProduct(id);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

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

    const deletedProduct = await productRepo.delete(id);
    return deletedProduct;
  },
};
