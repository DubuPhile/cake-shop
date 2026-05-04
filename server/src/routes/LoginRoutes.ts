import express from "express";
import { loginUser, registerUser } from "../controllers/loginController";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);

export default router;
