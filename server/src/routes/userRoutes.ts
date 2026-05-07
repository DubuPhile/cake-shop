import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  changePassword,
  sendOTPChangePwd,
} from "../controllers/userController";

const router = express.Router();

router.post("/changePwdOtp", verifyJWT, sendOTPChangePwd);
router.post("/changePwd", verifyJWT, changePassword);

export default router;
