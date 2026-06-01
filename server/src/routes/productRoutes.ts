import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/productController";
import verifyJWT from "../middleware/verifyJWT";
import { upload } from "../middleware/multer";
import { validate } from "../middleware/validate";
import { createProductSchema } from "../validator/auth.validator";

const router = express.Router();

router.get("/getAll", getAllProducts);
router.post(
  "/create",
  verifyJWT,
  upload.array("image", 10),
  validate(createProductSchema),
  createProduct,
);

export default router;
