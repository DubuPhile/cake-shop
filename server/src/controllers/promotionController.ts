import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { ImageService } from "../services/image.service";
import { PromotionBannerRepo } from "../repositories/promotionBanner.repository";

export const createBanner = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(403).json({ success: false, message: "Invalid" });
      return;
    }
    const { title, description, duration } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      res.status(400).json({ message: "No files Detected" });
      return;
    }

    const ImageUrls = await ImageService.uploadImgBanner(files);
    const createdBanner = await PromotionBannerRepo.createBanner(
      ImageUrls,
      title,
      description,
      duration,
    );

    res.status(201).json({ success: true, data: createdBanner });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error Server create Banner" });
  }
};
