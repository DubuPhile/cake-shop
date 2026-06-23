import express from "express";
import {
  RateProduct,
  rateProductReplies,
  toggleReviewLike,
} from "../controllers/reviewController";
import verifyJWT from "../middleware/verifyJWT";
import { validate } from "../middleware/validate";
import { idSchema, ratingSchema } from "../validator/auth.validator";

const router = express.Router();

router.post(
  "/rate/:id",
  verifyJWT,
  validate(idSchema, "params"),
  validate(ratingSchema),
  RateProduct,
);
router.post(
  "/rateReplies/:id",
  verifyJWT,
  validate(idSchema, "params"),
  validate(ratingSchema),
  rateProductReplies,
);
router.post(
  "/toggle/:id",
  verifyJWT,
  validate(idSchema, "params"),
  toggleReviewLike,
);

export default router;
