import { Request, Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import { reviewRepo } from "../repositories/review.repository";

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
    const { reviewId } = req.params;

    if (!reviewId) {
      res.status(400).json({ message: "Review ID not Found" });
      return;
    }

    const reviewIdString = reviewId.toString();

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
