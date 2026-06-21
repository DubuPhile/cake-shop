"use client";

import Spinner from "@/app/(components)/Spinner";
import { VerifyOTP } from "@/app/(components)/VerifyModal";
import { useRegisterMutation } from "@/redux/features/userAuth";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  setVerifyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVerify: React.Dispatch<React.SetStateAction<VerifyOTP | undefined>>;
}

export default function Register({ setVerifyModal, setVerify }: Props) {
  const [pwd, setPwd] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);

  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const [register, { isLoading: LoadRegister }] = useRegisterMutation();

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!user?.trim() || !email?.trim() || !pwd?.trim())
        throw new Error("Email, password and Username is required");

      const verEmail = {
        username: user,
        email: email,
        pwd: pwd,
      };

      const newUserData = await register(verEmail).unwrap();

      setVerifyModal(true);
      setVerify(newUserData?.data);
      toast.success(newUserData?.message, {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
    } catch (err: any) {
      console.log(err);
      toast.error(
        `${err.data?.message || "Invalid user, email or password."}`,
        {
          style: {
            fontWeight: "600",
            color: "red",
          },
        },
      );
    }
  };

  return (
    <>
      {LoadRegister ? (
        <Spinner />
      ) : (
        <div className="w-100 flex flex-col items-center justify-center">
          <h1 className="mt-10 mb-8 text-2xl font-bold">Create Account</h1>
          {errorMsg && (
            <p ref={errorRef} className="mx-3 my-1 text-base text-red-500">
              {errorMsg}
            </p>
          )}
          <form
            className="w-full flex flex-col items-center gap-3 mb-10"
            onSubmit={handleSubmit}
          >
            <p className="px-8 text-center text-sm text-gray-500 mb-3">
              Create new Account for newcomers.
            </p>

            <div className="group flex flex-col gap w-70">
              <label
                className={`cursor-text transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 dark:group-focus-within:text-gray-50 ${user ? "scale-80 -translate-x-3 translate-y-0 text-gray-900 dark:text-gray-50" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"} pointer-events-none`}
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="group px-3 py-2 rounded-2xl border border-gray-300"
                type="text"
                id="username"
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
            </div>
            <div className="group flex flex-col gap w-70">
              <label
                className={`cursor-text transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 group-focus-within:font-semibold dark:group-focus-within:text-gray-50 ${email ? "scale-80 -translate-x-3 translate-y-0 text-gray-900 dark:text-gray-50" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"} pointer-events-none`}
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
            <div className="group relative flex flex-col gap w-70 mb-5">
              <label
                className={`cursor-text transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 dark:group-focus-within:text-gray-50 ${pwd ? "scale-80 -translate-x-3 translate-y-0 text-gray-900 dark:text-gray-50" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"} pointer-events-none`}
                htmlFor="new-password"
              >
                Password
              </label>
              <div className="flex flex-row">
                <input
                  className="px-3 py-2 rounded-2xl border border-gray-300 w-70"
                  type={`${showPwd ? "text" : "password"}`}
                  id="new-password"
                  autoComplete="off"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
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

            <button
              type="submit"
              className="px-4 py-2 bg-pink-400 text-white font-semibold rounded-3xl hover:-translate-y-1 hover:bg-pink-500 active:bg-pink-600 active:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Create Account
            </button>
          </form>
        </div>
      )}
    </>
  );
}
