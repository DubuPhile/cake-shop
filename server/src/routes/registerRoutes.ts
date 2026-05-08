import express from "express";
import { validate } from "../middleware/validate";
import { registerSchema } from "../validator/auth.validator";
import { registerUser } from "../controllers/registerController";

const router = express.Router();

router.post("/", validate(registerSchema), registerUser);

export default router;
