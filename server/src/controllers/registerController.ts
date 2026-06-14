import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body;

    if (!body.username || !body.pwd || !body.email) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const register = await AuthService.Register(body);

    res.status(200).json({
      message: "Register Successfully",
      success: true,
      data: register.OtpData,
    });
  } catch (err: any) {
    if (err.message === "EMAIL_ALREADY_REGISTERED") {
      res.status(409).json({ message: "User Already Exists", success: false });
      return;
    }
    console.log(err);
    res.status(500).json({ message: "Error to register this user" });
  }
};
