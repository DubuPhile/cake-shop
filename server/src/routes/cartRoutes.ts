import express from "express";
import { addToCart, deleteCart, getCarts } from "../controllers/cartController";
import verifyJWT from "../middleware/verifyJWT";
import { validate } from "../middleware/validate";
import { AddToCartSchema, idSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/create", verifyJWT, validate(AddToCartSchema), addToCart);
router.get("/", verifyJWT, getCarts);
router.delete("/:id", verifyJWT, validate(idSchema, "params"), deleteCart);

export default router;
