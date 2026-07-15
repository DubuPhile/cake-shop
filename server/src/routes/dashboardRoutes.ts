import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import { verifyRoles } from "../middleware/verifyRoles";
import ROLE_LIST from "../config/roleLists";
import {
  getLatestStats,
  getMonthlyStats,
} from "../controllers/dashboardController";

const router = express.Router();

router.get("/stats", verifyJWT, verifyRoles(ROLE_LIST.Admin), getLatestStats);
router.get(
  "/monthly",
  verifyJWT,
  verifyRoles(ROLE_LIST.Admin),
  getMonthlyStats,
);

export default router;
