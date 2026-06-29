import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { ImageService } from "../services/image.service";
import { PromotionBannerRepo } from "../repositories/promotionBanner.repository";
import { UserRepo } from "../repositories/user.repository";
import { PromoBanner } from "../types/promotional.types";

export const getBanners = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Invalid user" });
      return;
    }
    const user = await UserRepo.findbyId(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const banners = await PromotionBannerRepo.getBanners();
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error in get banner" });
  }
};

export const createBanner = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(403).json({ success: false, message: "Invalid" });
      return;
    }
    const payload = req.body as PromoBanner;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      res.status(400).json({ message: "No files Detected" });
      return;
    }

    const ImageUrls = await ImageService.uploadImgBanner(files);
    const createdBanner = await PromotionBannerRepo.createBanner(
      ImageUrls,
      payload,
    );

    res.status(201).json({ success: true, data: createdBanner });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error Server create Banner" });
  }
};
