import express from "express";
import { verifyOTP } from "../controllers/OTPController";
import { validate } from "../middleware/validate";
import { verifyOtpSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/", validate(verifyOtpSchema), verifyOTP);

export default router;
