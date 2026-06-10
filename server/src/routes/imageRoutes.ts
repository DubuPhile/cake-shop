import express from "express";
import { addImage, deleteImage } from "../controllers/imageController";
import verifyJWT from "../middleware/verifyJWT";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";
import { validate } from "../middleware/validate";
import { idSchema } from "../validator/auth.validator";
import { upload } from "../middleware/multer";

const router = express.Router();

router.patch(
  "/:id",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  upload.array("images", 10),
  validate(idSchema, "params"),
  addImage,
);

router.delete(
  "/:id",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  validate(idSchema, "params"),
  deleteImage,
);

export default router;
