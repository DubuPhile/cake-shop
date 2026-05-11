import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

type OtpPurpose =
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

export const sendOTP = async (generateOTP: OTPRequest) => {
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

      return { otp, createdOtp };
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

    return { otp, createdOtp };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otpCode, email, purpose } = req.body;

    if (otpCode.length !== 6 || typeof otpCode !== "string") {
      res.status(400).json({
        message: "Invalid OTP Format",
        success: false,
      });
      return;
    }

    const foundOtp = await prisma.otp.findFirst({
      where: {
        email,
        purpose,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!foundOtp) {
      res.status(404).json({
        message: "OTP not found or expired",
        success: false,
      });
      return;
    }

    // 2. check attempts
    if (foundOtp.attempts >= 5) {
      res.status(429).json({
        message: "Too many attempts",
        success: false,
      });
      return;
    }

    // 3. compare OTP
    const isValid = await bcrypt.compare(otpCode, foundOtp.code);

    if (!isValid) {
      // increase attempts
      await prisma.otp.update({
        where: { id: foundOtp.id },
        data: {
          attempts: { increment: 1 },
        },
      });

      res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
      return;
    }

    const verified = await prisma.otp.update({
      where: { id: foundOtp.id },
      data: {
        isUsed: true,
      },
      select: {
        id: true,
      },
    });

    if (foundOtp.name && foundOtp.password && purpose === "VERIFY_EMAIL") {
      await prisma.users.create({
        data: {
          name: foundOtp.name,
          password: foundOtp.password,
          email: foundOtp.email,
        },
      });

      await prisma.otp.delete({
        where: { id: foundOtp.id, isUsed: true, purpose },
      });

      res
        .status(201)
        .json({ message: "Create user Successfully", success: true });
      return;
    }
    // Verify Login
    if (purpose === "LOGIN") {
      const foundUser = await prisma.users.findFirst({
        where: {
          email: foundOtp.email,
        },
      });
      if (!foundUser) {
        res.status(404).json({ message: "User not Found" });
        return;
      }

      const deviceToken = crypto.randomBytes(32).toString("hex");
      const hashed = crypto
        .createHash("sha256")
        .update(deviceToken)
        .digest("hex");

      await prisma.trustedDevice.create({
        data: {
          userId: foundUser.userId,
          deviceToken: hashed,
          ipAddress: req.ip ?? null,
          userAgent: req.headers["user-agent"] ?? null,
          verifiedAt: new Date(),
        },
      });

      res.cookie("device_id", deviceToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      });

      const roles = foundUser.roles ?? [];

      const accessToken = jwt.sign(
        {
          UserInfo: {
            _id: foundUser.userId,
            user: foundUser.name,
            isAdmin: foundUser.isAdmin,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { user: foundUser.name },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1h" },
      );

      await prisma.users.update({
        where: { userId: foundUser.userId },
        data: {
          refreshToken,
        },
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      await prisma.otp.delete({
        where: { id: foundOtp.id, isUsed: true, purpose },
      });

      res.status(200).json({ accessToken });
      return;
    }

    res
      .status(200)
      .json({ message: "Verify Successfully", success: true, data: verified });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP Server Error", success: false });
  }
};
