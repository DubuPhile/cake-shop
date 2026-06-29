import express from "express";
import { loginUser } from "../controllers/loginController";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validator/auth.validator";
import { loginLimiter } from "../middleware/rateLimiter";
import { throttle } from "../middleware/throttle";

const router = express.Router();

router.post(
  "/",
  throttle(1000),
  loginLimiter,
  validate(loginSchema),
  loginUser,
);

export default router;
