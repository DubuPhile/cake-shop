import { Otp, OTPRequest } from "../controllers/OTPController";
import bcrypt from "bcrypt";
import { OtpRepo } from "../repositories/otp.repository";
import { OTPEmailStyle, sendEmail } from "../utils/sendEmail";

export const sendOTP = async (generateOTP: OTPRequest): Promise<Otp> => {
  try {
    const { email, purpose, name, password } = generateOTP;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await OtpRepo.deleteOtp(email, purpose);

    if (name && password && purpose === "VERIFY_EMAIL") {
      const createdOtp = await OtpRepo.createOTPNewAccount({
        name: name,
        purpose: purpose,
        password: password,
        expiresAt: expiresAt,
        code: hashedOtp,
        email: email,
      });

      if (!createdOtp) {
        throw new Error("Failed to Create OTP");
      }

      //SEND EMAIL
      const emailOtp = await sendEmail({
        to: createdOtp?.email || "",
        subject: "Verification OTP",
        html: OTPEmailStyle(otp),
      });

      if (emailOtp.error?.statusCode) throw new Error("Failed to Send Email");

      console.log(otp); // for test
      return { createdOtp };
    }

    const createdOtp = await OtpRepo.createOTPExistingAccount({
      email,
      purpose,
      code: hashedOtp,
      expiresAt,
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
