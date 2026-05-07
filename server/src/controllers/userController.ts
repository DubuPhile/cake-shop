import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middleware/verifyJWT";
import { OTPRequest, sendOTP } from "./OTPController";

export const changePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { newPwd, currentPwd, verified } = req.body;

    if (!userId) {
      res.status(400).json({ message: "userId not found" });
      return;
    }

    const verifiedOtp = await prisma.otp.findFirst({
      where: { id: verified, isUsed: true },
    });
    if (!verifiedOtp) {
      res.status(403).json({ message: "not verified" });
      return;
    }

    const foundUser = await prisma.users.findFirst({
      where: { userId: userId },
    });
    if (!foundUser) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const matchPwd = bcrypt.compare(currentPwd, foundUser.password);
    if (!matchPwd) {
      res.status(400).json({ message: "password not match" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(newPwd, salt);

    await prisma.users.update({
      where: {
        userId: foundUser.userId,
        email: foundUser.email,
      },
      data: {
        password: hashedPwd,
      },
    });

    await prisma.otp.delete({ where: { id: verifiedOtp.id } });

    res
      .status(200)
      .json({ message: "Change password Success!", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error changePassword Server", success: false });
  }
};

export const sendOTPChangePwd = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "userId not found" });
      return;
    }
    const foundUser = await prisma.users.findFirst({
      where: { userId: userId },
      select: { email: true },
    });
    if (!foundUser) {
      res.status(404);
      return;
    }
    const verifyEmail = {
      email: foundUser.email,
      purpose: "CHANGE_PASSWORD",
    } as OTPRequest;

    const sendOtp = sendOTP(verifyEmail);
    console.log((await sendOtp).otp);
    res.status(200).json({
      message: "send OTP for Change Password",
      data: (await sendOtp).createdOtp,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error send OTP for Change Password", success: false });
  }
};
