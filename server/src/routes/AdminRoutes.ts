import express from "express";
import { deleteUser, getUser } from "../controllers/adminController";
import verifyJWT from "../middleware/verifyJWT";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";

const router = express.Router();

router.get("/get-user", verifyJWT, verifyRoles(ROLE_LIST.Admin), getUser);
router.delete(
  "/deleteUser/:id",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  deleteUser,
);

export default router;
