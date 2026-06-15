import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OTPEmailStyle, sendEmail } from "../utils/sendEmail";
import { OtpRepo } from "../repositories/otp.repository";
import { TokenService } from "../services/token.service";
import { UserInfo } from "../types/token.types";
import { UserRepo } from "../repositories/user.repository";
import { TrustedDeviceRepo } from "../repositories/trustedDevice.repository";
import { VerifyOTP } from "../types/auth.types";
import { AuthService } from "../services/auth.service";

export type OtpPurpose =
  | "VERIFY_EMAIL"
  | "RESET_PASSWORD"
  | "LOGIN"
  | "CHANGE_PASSWORD";

export interface OTPRequest extends Request {
  email: string;
  name?: string;
  password?: string;
  purpose: OtpPurpose;
}

type createdOtp = {
  email: string;
  purpose: OtpPurpose;
  id: string;
};

export interface Otp {
  createdOtp: createdOtp;
}

export const sendOTP = async (generateOTP: OTPRequest): Promise<Otp> => {
  try {
    const { email, purpose, name, password } = generateOTP;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await prisma.otp.deleteMany({
      where: { email, purpose },
    });

    if (name && password && purpose === "VERIFY_EMAIL") {
      const createdOtp = await prisma.otp.create({
        data: {
          name,
          password,
          email,
          code: hashedOtp,
          expiresAt,
          purpose,
        },
        select: {
          id: true,
          email: true,
          purpose: true,
        },
      });
      //SEND EMAIL
      const emailOtp = await sendEmail({
        to: createdOtp.email,
        subject: "Verification OTP",
        html: OTPEmailStyle(otp),
      });

      if (emailOtp.error?.statusCode) throw new Error("Failed to Send Email");

      console.log(otp); // for test
      return { createdOtp };
    }

    const createdOtp = await prisma.otp.create({
      data: {
        email,
        code: hashedOtp,
        expiresAt,
        purpose,
      },
      select: {
        id: true,
        email: true,
        purpose: true,
      },
    });
    //SEND EMAIL
    const emailOtp = await sendEmail({
      to: createdOtp.email,
      subject: "Verification OTP",
      html: OTPEmailStyle(otp),
    });

    if (emailOtp.error?.statusCode) throw new Error("Failed to Send Email");

    console.log(otp); //for Test
    return { createdOtp };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send OTP");
  }
};

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
        break;
      case "LOGIN":
        res.cookie("device_id", result?.deviceToken, {
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
        break;

      default:
        res.status(200).json(result);
        break;
    }
  } catch (err: any) {
    console.log(err);
    switch (err.message) {
      case "OTP_NOT_FOUND":
        res.status(404).json({
          message: "OTP not found or expired",
          success: false,
        });
        break;
      case "ATTEMPTS_REACHED":
        res.status(429).json({
          message: "Too many attempts",
          success: false,
        });
        break;
      case "INVALID_OTP":
        res.status(400).json({
          message: "Invalid OTP",
          success: false,
        });
        break;
      case "USER_NOT_FOUND":
        res.status(404).json({ message: "User not Found" });
        break;

      default:
        res
          .status(500)
          .json({ success: false, message: "ERROR SERVER VERIFYOTP" });
    }
  }
};
