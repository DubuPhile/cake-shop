import express from "express";
import { createOrder } from "../controllers/orderController";
import verifyJWT from "../middleware/verifyJWT";
import { validate } from "../middleware/validate";
import { createOrderSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/create", verifyJWT, validate(createOrderSchema), createOrder);

export default router;
