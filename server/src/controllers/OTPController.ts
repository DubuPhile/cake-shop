import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

type OtpPurpose = "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN";

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
      await prisma.otp.create({
        data: {
          name,
          password,
          email,
          code: hashedOtp,
          expiresAt,
          purpose,
        },
      });

      return { otp, purpose };
    }

    await prisma.otp.create({
      data: {
        email,
        code: hashedOtp,
        expiresAt,
        purpose,
      },
    });

    return { otp, purpose };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otpCode, email, purpose } = req.body;
    if (otpCode.length !== 6 || typeof otpCode !== "string") {
      res.status(400).json({ message: "invalid Code" });
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

    await prisma.otp.update({
      where: { id: foundOtp.id },
      data: {
        isUsed: true,
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

    res.status(200).json({ message: "Verify Successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP Server Error", success: false });
  }
};
