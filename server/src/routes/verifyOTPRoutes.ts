import express from "express";
import { resendOTP, verifyOTP } from "../controllers/OTPController";
import { validate } from "../middleware/validate";
import { resendOtp, verifyOtpSchema } from "../validator/auth.validator";

const router = express.Router();

router.post("/", validate(verifyOtpSchema), verifyOTP);
router.post("/resend", validate(resendOtp), resendOTP);

export default router;
