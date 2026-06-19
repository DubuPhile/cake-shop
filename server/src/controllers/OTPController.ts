import { Request, Response } from "express";
import { OtpRepo } from "../repositories/otp.repository";
import { VerifyOTP } from "../types/auth.types";
import { AuthService } from "../services/auth.service";
import { sendOTP } from "../services/otp.service";
import { OTPRequest } from "../types/otp.types";

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, purpose } = req.body;

    const foundOTP = await OtpRepo.searchOTP(email, purpose);

    if (!foundOTP) {
      res.status(404).json({ message: "OTP no match found" });
      return;
    }

    if (foundOTP.name && foundOTP.password && purpose === "VERIFY_EMAIL") {
      const verifyEmail = {
        email: foundOTP.email,
        name: foundOTP.name,
        password: foundOTP.password,
        purpose: foundOTP.purpose,
      } as OTPRequest;

      const OTPData = await sendOTP(verifyEmail);

      res
        .status(200)
        .json({ message: "Resend OTP success!", success: true, data: OTPData });
      return;
    }

    const verifyEmail = {
      email: foundOTP.email,
      purpose: foundOTP.purpose,
    } as OTPRequest;

    const OTPData = await sendOTP(verifyEmail);

    res
      .status(200)
      .json({ message: "Resend OTP success!", success: true, data: OTPData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error ResetOTP", success: false });
  }
};

/* VERIFY OTP */

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body as VerifyOTP;

    const result = await AuthService.verifyOTP(payload, req);

    switch (payload.purpose) {
      case "VERIFY_EMAIL":
        res.status(201).json(result);
        return;
      case "LOGIN":
        res.cookie(`device_${result.userId}`, result?.deviceToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
        });

        res.cookie("jwt", result?.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.status(200).json({ accessToken: result?.accessToken });
        return;

      default:
        res.status(200).json(result);
        return;
    }
  } catch (err: any) {
    console.log(err);
    switch (err.message) {
      case "OTP_NOT_FOUND":
        res.status(404).json({
          message: "OTP not found or expired",
          success: false,
        });
        return;
      case "ATTEMPTS_REACHED":
        res.status(429).json({
          message: "Too many attempts",
          success: false,
        });
        return;
      case "INVALID_OTP":
        res.status(400).json({
          message: "Invalid OTP",
          success: false,
        });
        return;
      case "USER_NOT_FOUND":
        res.status(404).json({ message: "User not Found" });
        return;

      default:
        res
          .status(500)
          .json({ success: false, message: "ERROR SERVER VERIFYOTP" });
    }
  }
};
