import express from "express";
import { loginUser } from "../controllers/loginController";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/", validate(loginSchema), loginUser);

export default router;
