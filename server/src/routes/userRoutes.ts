import express from "express";
import { RateProduct } from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";

const router = express.Router();

router.post("/rate/:Id", verifyJWT, RateProduct);

export default router;
