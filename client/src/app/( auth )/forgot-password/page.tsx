"use client";

import Spinner from "@/app/(components)/Spinner";
import { OTPModal, VerifyOTP } from "@/app/(components)/VerifyModal";
import { useVerifyOTPMutation } from "@/redux/features/OTPAuth";
import {
  useResetPwdMutation,
  useResetPwdOtpMutation,
} from "@/redux/features/passwordAuth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  const [newPwd, setNewPwd] = useState<string>("");
  const [confirmPwd, setConfirmPwd] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false);
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [verifyModal, setVerifyModal] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const [errorMatch, setErrorMatch] = useState<string>("");

  const [sendResetOtp, { isLoading: loadResetOtp }] = useResetPwdOtpMutation();
  const [resetPwd, { isLoading: loadResetPwd }] = useResetPwdMutation();
  const [verify, { isLoading: loadVerify }] = useVerifyOTPMutation();
  const [verifyEmail, setVerifyEmail] = useState<VerifyOTP | undefined>();

  useEffect(() => {
    setErrorMsg("");
  }, [email, newPwd, confirmPwd]);

  useEffect(() => {
    if (confirmPwd === "") {
      setErrorMatch("");
      return;
    }

    if (newPwd !== confirmPwd) {
      setErrorMatch("Passwords do not match.");
      return;
    }

    setErrorMatch("");
  }, [confirmPwd]);

  const handleSubmit = async () => {
    try {
      if (!email) return;
      const OtpData = await sendResetOtp(email).unwrap();
      setVerifyEmail(OtpData?.data);
      setVerifyModal(true);
      setErrorMsg("");
      toast.success(`${OtpData.message || "Verification sent."}`);
    } catch (err: any) {
      console.log(err);
      toast.error(`${err?.data?.message || "Invalid Email"}`);
      setErrorMsg(`${err?.data?.message || "Invalid Email"}`);
    }
  };
  const handleSubmitNewPwd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newPwd !== confirmPwd) return;
      const success = await resetPwd({ email: email, newPwd: newPwd }).unwrap();

      setEmail("");
      setNewPwd("");
      setConfirmPwd("");
      setErrorMsg("");
      toast.success(`${success?.message || "Reset Password"}`);
      router.push("/login");
    } catch (err: any) {
      console.log(err);
      toast.error(`${err?.data?.message || "Invalid New Password"}`);
      setErrorMsg(`${err?.data?.message || "Invalid New Password"}`);
    }
  };

  const verifyOtp = async (otp: number) => {
    if (!verifyEmail) return;

    const success = await verify({
      purpose: verifyEmail.purpose,
      otpCode: otp,
      email: verifyEmail.email,
    }).unwrap();

    setIsVerify(true);
    setVerifyModal(false);
    toast.success("Verification successful!");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-screen flex items-center h-screen justify-center max-w-300">
        {loadResetOtp || loadResetPwd || loadVerify ? (
          <Spinner />
        ) : (
          <div className="w-100vw w-125 max-w-125 flex items-center justify-center">
            <div className="w-100 flex flex-col items-center justify-center bg-gray-50 rounded-2xl drop-shadow-lg">
              <h1 className="mt-10 mb-8 text-2xl font-bold">Forgot Password</h1>
              {errorMsg && (
                <p ref={errorRef} className="mx-3 my-1 text-base text-red-500">
                  {errorMsg}
                </p>
              )}
              {!isVerify && (
                <form
                  className="w-full flex flex-col items-center gap-3 mb-10"
                  onSubmit={handleSubmit}
                >
                  <p className="px-8 text-center text-sm text-gray-500 mb-3">
                    Forgot your password? Please enter your email address. You
                    will receive a verification code via email.{" "}
                  </p>
                  <div className="group flex flex-col gap w-70">
                    <label
                      className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 ${email ? "scale-80 -translate-x-3 translate-y-0 text-gray-900" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"}`}
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="group px-3 py-2 rounded-2xl border border-gray-300"
                      type="text"
                      id="email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                  <div className="flex w-70 my-5 items-center justify-between">
                    <Link
                      href={"/login"}
                      className="transition-all duration-300 hover:scale-110 hover:text-gray-700"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-400 text-white font-semibold rounded-3xl hover:scale-110 hover:bg-pink-500 active:bg-pink-600 active:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
              {isVerify && (
                <form
                  className="w-full flex flex-col items-center gap-3 mb-10"
                  onSubmit={handleSubmitNewPwd}
                >
                  <p className="px-8 text-center text-sm text-gray-500 mb-3">
                    Set a new Password. It should be match and unique.
                  </p>
                  <div className="group relative flex flex-col gap w-70">
                    <label
                      className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 ${newPwd ? "scale-80 -translate-x-3 translate-y-0 text-gray-900" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"}`}
                      htmlFor="new-password"
                    >
                      New Password
                    </label>
                    <div className="flex flex-row">
                      <input
                        className="px-3 py-2 rounded-2xl border border-gray-300 w-70"
                        type={`${showPwd ? "text" : "password"}`}
                        id="new-password"
                        autoComplete="off"
                        onChange={(e) => setNewPwd(e.target.value)}
                        value={newPwd}
                        required
                      />
                      <span
                        className="absolute right-2.5 bottom-2.5 cursor-pointer text-gray-600 z-10"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        {showPwd ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  </div>

                  <div className="group relative flex flex-col gap w-70">
                    <label
                      className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 ${confirmPwd ? "scale-80 -translate-x-3 translate-y-0 text-gray-900" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"}`}
                      htmlFor="confirm-password"
                    >
                      Confirm Password
                    </label>
                    <div className="flex flex-row">
                      <input
                        className="px-3 py-2 rounded-2xl border border-gray-300 w-70"
                        type={`${showConfirmPwd ? "text" : "password"}`}
                        id="confirm-password"
                        autoComplete="off"
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        value={confirmPwd}
                        required
                      />
                      <span
                        className="absolute right-2.5 bottom-2.5 cursor-pointer text-gray-600 z-10"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      >
                        {showConfirmPwd ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  </div>
                  {errorMatch ? (
                    <p className="mx-3 my-1 text-base text-red-500">
                      {errorMatch}
                    </p>
                  ) : (
                    <p> </p>
                  )}

                  <div className="flex w-70 my-5 items-center justify-between">
                    <button
                      type="button"
                      className="transition-all duration-300 hover:scale-110 hover:text-gray-700"
                      onClick={() => setIsVerify(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-400 text-white font-semibold rounded-3xl hover:scale-110 hover:bg-pink-500 active:bg-pink-600 active:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      {verifyModal && (
        <OTPModal
          isOpen={verifyModal}
          onClose={() => setVerifyModal(false)}
          verifyData={verifyEmail}
          verifyOtp={verifyOtp}
        />
      )}
    </div>
  );
}
