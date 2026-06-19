import express from "express";
import {
  addSize,
  createProduct,
  deleteProduct,
  deleteSize,
  getAllProducts,
  getAllStocks,
  getCategory,
  getProductInfo,
  getProductStock,
  updateProduct,
  updateStocks,
} from "../controllers/productController";
import verifyJWT from "../middleware/verifyJWT";
import { upload } from "../middleware/multer";
import { validate } from "../middleware/validate";
import {
  createProductSchema,
  idSchema,
  ProductDetailSchema,
  sizeArraySchema,
  sizeSchema,
} from "../validator/auth.validator";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";

const router = express.Router();
router.get("/category", getCategory);
router.get("/getAll", getAllProducts);
router.get("/getAllStock", verifyJWT, getAllStocks);
router.get("/getStock/:id", getProductStock);
router.get("/:id", getProductInfo);

router.post(
  "/create",
  verifyJWT,
  upload.array("images", 10),
  validate(createProductSchema),
  createProduct,
);

router.post(
  "/updateStock",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(sizeArraySchema),
  updateStocks,
);

router.post(
  "/addSize",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(sizeSchema, "body"),
  addSize,
);

router.delete(
  "/:id/size",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(idSchema, "params"),
  deleteSize,
);
router.delete(
  "/:id",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(idSchema, "params"),
  deleteProduct,
);

router.patch(
  "/:productId",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(ProductDetailSchema),
  updateProduct,
);

export default router;
