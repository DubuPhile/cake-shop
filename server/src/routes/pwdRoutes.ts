import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  changePassword,
  resetPassword,
  sendOTPChangePwd,
  sendOTPResetPwd,
} from "../controllers/pwdController";
import { validate } from "../middleware/validate";
import { verifyEmail, VerifyResetPwd } from "../validator/auth.validator";

const router = express.Router();

router.post("/changePwdOtp", verifyJWT, sendOTPChangePwd);
router.post("/changePwd", verifyJWT, changePassword);
router.post("/resetPwdOtp", validate(verifyEmail), sendOTPResetPwd);
router.post("/resetPwd", validate(VerifyResetPwd), resetPassword);

export default router;
