import express from "express";
import { getUser } from "../controllers/adminController";
import verifyJWT from "../middleware/verifyJWT";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";

const router = express.Router();

router.get("/get-user", verifyJWT, verifyRoles(ROLE_LIST.Admin), getUser);

export default router;
