import express from "express";
import {
  addSize,
  createProduct,
  deleteProduct,
  deleteSize,
  getAllProducts,
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
  deleteSchema,
  ProductDetailSchema,
  sizeArraySchema,
  sizeSchema,
} from "../validator/auth.validator";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";

const router = express.Router();

router.get("/getAll", getAllProducts);
router.get("/:id", getProductInfo);

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
  "/:Id/size",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(deleteSchema, "params"),
  deleteSize,
);
router.delete(
  "/:Id",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(deleteSchema, "params"),
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
