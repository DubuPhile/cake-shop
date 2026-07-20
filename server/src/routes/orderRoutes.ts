import express from "express";
import {
  createOrder,
  getRecentOrders,
  getTotalOrderPerStatus,
} from "../controllers/orderController";
import verifyJWT from "../middleware/verifyJWT";
import { validate } from "../middleware/validate";
import { createOrderSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/create", verifyJWT, validate(createOrderSchema), createOrder);
router.get("/count-by-status", verifyJWT, getTotalOrderPerStatus);
router.get("/recent-orders", verifyJWT, getRecentOrders);

export default router;
