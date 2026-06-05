import express from "express";
import { RateProduct, rateProductReplies } from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";
import { validate } from "../middleware/validate";
import { ratingSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/rate/:Id", verifyJWT, validate(ratingSchema), RateProduct);
router.post(
  "/rateReplies/:parentId",
  verifyJWT,
  validate(ratingSchema),
  rateProductReplies,
);

export default router;
