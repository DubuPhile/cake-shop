import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { reviewRepo } from "../repositories/review.repository";
import { RateProd } from "../types/product.types";
import { ProductService } from "../services/product.service";

export const toggleReviewLike = async (
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
      res.status(400).json({ message: "Review ID not Found" });
      return;
    }

    const reviewIdString = id.toString();

    const existingLike = await reviewRepo.checkExistLikes(
      userId,
      reviewIdString,
    );

    if (existingLike) {
      const result = await reviewRepo.decreaseLikes(
        existingLike.id,
        reviewIdString,
      );

      res.json({
        liked: result,
      });
      return;
    }
    const result = await reviewRepo.increaseLikes(userId, reviewIdString);

    res.status(200).json({
      liked: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "ERROR ToggleLikes" });
  }
};

export const RateProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const payload = req.body as RateProd;
    const files = (req.files as Express.Multer.File[]) || [];
    const userId = req.user?.id;
    if (!id) throw new Error("PRODUCT_NOT_FOUND");
    if (!userId) throw new Error("USER_NOT_FOUND");

    const reviewData = await ProductService.rateProduct(
      payload,
      userId,
      id?.toString(),
      files,
    );

    res
      .status(200)
      .json({ message: "Review Created!", success: true, data: reviewData });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "PRODUCT_NOT_FOUND":
          res.status(400).json({ success: false, message: err.message });
          return;
        case "USER_NOT_FOUND":
          res.status(401).json({ success: false, message: err.message });
          return;
      }
    }
    res.status(500).json({ success: false, message: "Rate Product Error!" });
  }
};

export const rateProductReplies = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { comment } = req.body;

    const createReply = await ProductService.replyProduct(
      comment,
      userId,
      id?.toString(),
    );

    res.status(201).json({
      success: true,
      message: "Reply to Comment Success!",
      data: createReply,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      switch (err.message) {
        case "FORBIDDEN":
          res
            .status(400)
            .json({ success: false, message: "Invalid userId or parentId" });
          return;
        case "USER_NOT_FOUND":
          res.status(404).json({ success: false, messsage: "User not found" });
          return;
        case "PARENT_NOT_FOUND":
          res
            .status(404)
            .json({ success: false, message: "Parent review not found" });
          return;
      }
    }
    res
      .status(500)
      .json({ success: false, message: "rate Product Replies Error" });
  }
};
