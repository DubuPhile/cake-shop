import express from "express";
import { addToCart, getCarts } from "../controllers/cartController";
import verifyJWT from "../middleware/verifyJWT";
import { validate } from "../middleware/validate";
import { AddToCartSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/create", verifyJWT, validate(AddToCartSchema), addToCart);
router.get("/", verifyJWT, getCarts);

export default router;
