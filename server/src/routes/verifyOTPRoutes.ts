import express from "express";
import { resendOTP, verifyOTP } from "../controllers/OTPController";
import { validate } from "../middleware/validate";
import { resendOtp, verifyOtpSchema } from "../validator/auth.validator";
import { throttle } from "../middleware/throttle";

const router = express.Router();

router.post("/", validate(verifyOtpSchema), verifyOTP);
router.post("/resend", throttle(60000), validate(resendOtp), resendOTP);

export default router;
