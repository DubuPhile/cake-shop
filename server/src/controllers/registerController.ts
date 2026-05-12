import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { OTPRequest, sendOTP } from "./OTPController";

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
    const purpose = "VERIFY_EMAIL";

    const verifyEmail = {
      name: username,
      password: hashedPassword,
      email,
      purpose,
    } as OTPRequest;
    const sendOtp = await sendOTP(verifyEmail);

    // const newUser = await prisma.users.create({
    //   data: {
    //     name: username,
    //     password: hashedPassword,
    //     email: email,
    //   },
    // });

    res.status(201).send({
      message: "Register Successfully",
      success: true,
      data: { sendOtp },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to register this user" });
  }
};
