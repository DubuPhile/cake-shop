import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middleware/verifyJWT";
import { OTPRequest, sendOTP } from "./OTPController";

/* CHANGE PASSWORD */

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

    const NewDetails = await prisma.users.update({
      where: {
        userId: foundUser.userId,
        email: foundUser.email,
      },
      data: {
        password: hashedPwd,
      },
      select: {
        userId: true,
        email: true,
        name: true,
      },
    });

    await prisma.otp.delete({ where: { id: verifiedOtp.id } });

    res.status(200).json({
      message: "Change password Success!",
      success: true,
      data: NewDetails,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error changePassword Server", success: false });
  }
};

/* SEND OTP FOR CHANGE PASSWORD */

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

    const OTPSent = await sendOTP(verifyEmail);
    console.log(OTPSent.otp);
    res.status(200).json({
      message: "send OTP for Change Password",
      data: OTPSent.createdOtp,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error send OTP for Change Password", success: false });
  }
};

/* SEND OTP FOR RESET PASSWORD */

export const sendOTPResetPwd = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    const foundUser = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!foundUser) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const verifyEmail = {
      email: foundUser.email,
      purpose: "RESET_PASSWORD",
    } as OTPRequest;

    const OTPSent = await sendOTP(verifyEmail);
    console.log(OTPSent.otp);

    res.status(200).json({
      message: "send OTP for Reset Password",
      data: OTPSent.createdOtp,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error Send OTP Reset password", success: false });
  }
};

/* RESET PASSWORD */

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { newPwd, email } = req.body;
    const foundOtp = await prisma.otp.findFirst({
      where: {
        email: email,
        isUsed: true,
        purpose: "RESET_PASSWORD",
      },
    });
    if (!foundOtp) {
      res.status(404).json({ message: "OTP not found" });
      return;
    }
    const foundUser = await prisma.users.findFirst({
      where: { email: email },
    });
    if (!foundUser) {
      res.status(404).json({ messsage: "User not found" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(newPwd, salt);

    const newPwdUser = await prisma.users.update({
      where: {
        userId: foundUser.userId,
        email: foundUser.email,
      },
      data: {
        password: hashedPwd,
      },
      select: {
        userId: true,
        email: true,
        name: true,
      },
    });

    await prisma.otp.delete({ where: { id: foundOtp.id } });

    res.status(200).json({
      message: "Reset Password Success!",
      success: true,
      data: newPwdUser,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error in Server Reset Password", success: false });
  }
};
