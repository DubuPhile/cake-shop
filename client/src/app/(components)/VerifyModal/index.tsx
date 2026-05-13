"use client";

import { resendOTP, useResendOTPMutation } from "@/redux/features/OTPAuth";

import { useEffect, useRef, useState } from "react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  verifyData: VerifyOTP | undefined;
  verifyOtp: any;
}

export interface VerifyOTP {
  email: string;
  id: string;
  purpose: "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN" | "CHANGE_PASSWORD";
}

export const OTPModal = ({
  isOpen,
  onClose,
  verifyData,
  verifyOtp,
}: OTPModalProps) => {
  const [show, setShow] = useState(false);
  const [resend] = useResendOTPMutation();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [error, setError] = useState<string>("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  if (!verifyData) return;

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(6).fill(""));
      setError("");
      setTimeLeft(60);
      inputsRef.current[0]?.focus();
      setShow(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }

    if (!value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      const resendEmail = {
        email: verifyData.email,
        purpose: verifyData.purpose,
      } as resendOTP;
      await resend(resendEmail).unwrap();
    } catch (err) {
      console.log(err);
      setError("Error Resend OTP");
    }
  };

  const handleVerify = async () => {
    try {
      const otpValue = otp.join("");

      if (otpValue.length < 6) {
        setError("Please enter all 6 digits");
        return;
      }
      await verifyOtp(otpValue);
    } catch (err: any) {
      console.log(err);
      setError(`${err?.data.message || "Invalid"}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl bg-white shadow-xl transition-all duration-500 ${
          show
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center rounded-t-2xl justify-between bg-gray-200 p-4">
          <h2 className="text-lg font-semibold">Enter OTP</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black hover:cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="mb-4 text-sm text-gray-500">
            Check your Email for OTP code
          </p>

          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                onChange={(e) => handleChange(e.target.value, idx)}
                className="h-12 w-12 rounded-lg border text-center text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <p className="mt-4 text-sm text-gray-500">
            {timeLeft > 0
              ? `Resend OTP in ${timeLeft}s`
              : "OTP expired. You can resend now."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 p-4">
          {timeLeft <= 0 && (
            <button
              onClick={() => {
                setOtp(new Array(6).fill(""));
                setError("");
                setTimeLeft(60);
                inputsRef.current[0]?.focus();
                handleResend(); // resend OTP API
              }}
              className="text-sm font-medium text-blue-600 hover:underline hover:cursor-pointer"
            >
              Resend OTP
            </button>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleVerify}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-blue-700"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
