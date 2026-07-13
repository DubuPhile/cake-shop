import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";
import { getDashboardStats } from "../controllers/dashboardController";

const router = express.Router();

router.get(
  "/stats",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  getDashboardStats,
);

export default router;
