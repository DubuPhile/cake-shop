"use client";

import { MyTokenPayload, VerifyOTP } from "@/app/( auth )/login/page";
import { useVerifyOTPMutation } from "@/redux/features/userAuth";
import { setCredentials } from "@/redux/state/auth";
import { useAppDispatch } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  verifyData: VerifyOTP | undefined;
}

export const OTPModal = ({ isOpen, onClose, verifyData }: OTPModalProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verify] = useVerifyOTPMutation();
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
    }
  }, [isOpen]);

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

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    const success = await verify({
      purpose: verifyData.purpose,
      otpCode: otpValue,
      email: verifyData.email,
    }).unwrap();

    const decoded = jwtDecode<MyTokenPayload>(success.accessToken);
    const dispat = dispatch(
      setCredentials({
        accessToken: success.accessToken,
        user: decoded?.UserInfo.user,
        roles: decoded?.UserInfo.roles,
      }),
    );
    console.log(dispat);
    router.push("/");

    console.log(success);

    if (!success) setError("Invalid OTP");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Enter OTP</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
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
        <div className="flex flex-col gap-2 border-t p-4">
          {timeLeft <= 0 && (
            <button
              onClick={() => {
                setOtp(new Array(6).fill(""));
                setError("");
                setTimeLeft(60);
                inputsRef.current[0]?.focus();

                // resend OTP API
                // sendOTP({ type: "CHANGE_PASSWORD" }).unwrap();
              }}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleVerify}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
