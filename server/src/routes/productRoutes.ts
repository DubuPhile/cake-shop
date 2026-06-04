import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductStock,
  updateStocks,
} from "../controllers/productController";
import verifyJWT from "../middleware/verifyJWT";
import { upload } from "../middleware/multer";
import { validate } from "../middleware/validate";
import { createProductSchema } from "../validator/auth.validator";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";

const router = express.Router();

router.get("/getAll", getAllProducts);
router.post(
  "/create",
  verifyJWT,
  upload.array("image", 10),
  validate(createProductSchema),
  createProduct,
);
router.get("/getStock/:id", getProductStock);
router.post(
  "/updateStock",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  updateStocks,
);

router.delete(
  "/:productId",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  deleteProduct,
);

export default router;
