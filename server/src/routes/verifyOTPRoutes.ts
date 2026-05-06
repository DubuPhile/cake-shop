import express from "express";
import { verifyOTP } from "../controllers/OTPController";

const router = express.Router();

router.post("/", verifyOTP);

export default router;
