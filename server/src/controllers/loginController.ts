import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OTPRequest, sendOTP } from "./OTPController";

type loginUser = {
  user: string;
  pwd: string;
};

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, pwd, email } = req.body;
    if (!username || !pwd || !email) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      res.status(409).json({ message: "user Already Exist", success: false });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    // const verifyEmail = {
    //   name: username,
    //   password: hashedPassword,
    //   email,
    //   purpose: "VERIFY_EMAIL",
    // } as OTPRequest;
    // const sendOtp = await sendOTP(verifyEmail);
    //  console.log(sendOtp.otp);

    const newUser = await prisma.users.create({
      data: {
        name: username,
        password: hashedPassword,
        email: email,
      },
    });

    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to register this user" });
  }
};

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
    res.status(500).json({ message: "Login Failed", success: false });
  }
};
