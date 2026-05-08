import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OTPRequest, sendOTP } from "./OTPController";
import crypto from "crypto";

type loginUser = {
  user: string;
  pwd: string;
};

// Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, pwd } = req.body as loginUser;
    if (!pwd || !user) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const foundUser = await prisma.users.findFirst({
      where: {
        OR: [{ name: user }, { email: user }],
      },
    });
    if (!foundUser) {
      res.status(401);
      return;
    }
    // Check lock
    if (
      foundUser.lockUntil &&
      new Date(foundUser.lockUntil).getTime() > Date.now()
    ) {
      const mins = Math.ceil(
        (new Date(foundUser.lockUntil).getTime() - Date.now()) / 60000,
      );

      res.status(403).json({
        message: `Account locked. Try again in ${mins} minutes.`,
      });
      return;
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (!match) {
      const MAX_ATTEMPTS = 5;
      const LOCK_TIME = 30 * 60 * 1000;

      const attempts = (foundUser.loginAttempts ?? 0) + 1;

      const shouldLock = attempts >= MAX_ATTEMPTS;

      await prisma.users.update({
        where: { userId: foundUser.userId },
        data: {
          loginAttempts: attempts,
          lockUntil: shouldLock
            ? new Date(Date.now() + LOCK_TIME)
            : foundUser.lockUntil,
        },
      });

      if (shouldLock) {
        res.status(403).json({
          message:
            "Account locked due to too many failed login attempts. Try again later.",
        });
        return;
      }

      res.status(401).json({ message: "Invalid User & password" });
      return;
    }

    // reset attempts after success
    const updatedUser = await prisma.users.update({
      where: { userId: foundUser.userId },
      data: {
        loginAttempts: 0,
        lockUntil: null,
      },
    });

    //add verify device
    const deviceToken = req.cookies?.device_id;

    let trustedDevice = null;

    if (deviceToken) {
      const hashed = crypto
        .createHash("sha256")
        .update(deviceToken)
        .digest("hex");

      trustedDevice = await prisma.trustedDevice.findFirst({
        where: {
          userId: foundUser.userId,
          deviceToken: hashed,
        },
      });
    }

    if (!trustedDevice) {
      const verifyOTP = {
        email: foundUser.email,
        purpose: "LOGIN",
      } as OTPRequest;

      const generateOtp = await sendOTP(verifyOTP);
      console.log(generateOtp.otp);

      res
        .status(200)
        .json({ message: "Verify Login First", data: generateOtp.createdOtp });
      return;
    }

    const roles = updatedUser.roles ?? [];

    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: updatedUser.userId,
          user: updatedUser.name,
          isAdmin: updatedUser.isAdmin,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { user: updatedUser.name },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1h" },
    );

    await prisma.users.update({
      where: { userId: updatedUser.userId },
      data: {
        refreshToken,
      },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login Failed", success: false });
  }
};
