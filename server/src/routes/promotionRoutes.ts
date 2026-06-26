import express from "express";
import { createBanner, getBanners } from "../controllers/promotionController";
import verifyJWT from "../middleware/verifyJWT";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";
import { upload } from "../middleware/multer";
import { validate } from "../middleware/validate";
import { PromotionSchema } from "../validator/auth.validator";

const router = express.Router();

router.get("/", verifyJWT, verifyRoles(ROLE_LIST.Admin), getBanners);

router.post(
  "/create",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  upload.single("images"),
  validate(PromotionSchema),
  createBanner,
);

export default router;
