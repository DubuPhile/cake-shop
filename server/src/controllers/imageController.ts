import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { bucket } from "../config/firebase";
import { ProductImageService } from "../services/productImage.service";
import { productRepo } from "../repositories/product.repository";
import { UserRepo } from "../repositories/user.repository";
import { imgProdRepo } from "../repositories/productImg.repository";

export const addImage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const files = (req.files as Express.Multer.File[]) || [];
    const { id } = req.params;

    if (files.length === 0) {
      res.status(400).json({ message: "No files Detected" });
    }

    if (!id) {
      res.status(400).json({ message: "Product ID not found" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await UserRepo.findbyId(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const product = await productRepo.findProductbyId(id.toString());

    if (!product) {
      res.status(400).json({ message: "Product ID not found" });
      return;
    }

    const imageUrls = await ProductImageService.uploadImage(
      files,
      product.name,
    );
    const updatedproduct = await productRepo.addImage(product.id, imageUrls);

    res.status(201).json({
      success: true,
      message: "Image Added Success!",
      data: updatedproduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "ERROR SERVER ADD IMAGE" });
  }
};

export const deleteImage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Product ID not found" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await UserRepo.findbyId(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const foundImage = await imgProdRepo.findImg(id.toString());

    if (!foundImage) {
      res.status(404).json("Image not Found");
      return;
    }

    if (foundImage.path) {
      await bucket.file(foundImage.path).delete();
    }

    if (foundImage.url?.includes("/o/")) {
      const encodedPath = foundImage.url.split("/o/")[1];
      const filePath = decodeURIComponent(encodedPath?.split("?")[0] ?? "");
      await bucket.file(filePath).delete();
    }

    await imgProdRepo.delete(foundImage.id);

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error Server Delete Img" });
  }
};
