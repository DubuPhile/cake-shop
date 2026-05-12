"use client";

import { OTPModal } from "@/app/(components)/VerifyModal";
import { useLoginMutation } from "@/redux/features/userAuth";
import { setCredentials } from "@/redux/state/auth";
import { useAppDispatch } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type UserInfo = {
  user: string;
  roles: string[];
  isAdmin: boolean;
};

export interface MyTokenPayload {
  UserInfo: UserInfo;
}
export interface VerifyOTP {
  email: string;
  id: string;
  purpose: "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN" | "CHANGE_PASSWORD";
}

export default function login() {
  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);

  const [verifyModal, setVerifyModal] = useState<boolean>(false);
  const [verify, setVerify] = useState<VerifyOTP | undefined>();

  const [errMsg, setErrMsg] = useState<string>("");

  const userRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const userData = await login({
        user: user,
        pwd: pwd,
      }).unwrap();

      console.log(userData);
      if (userData?.message === "Verify Login First") {
        setVerifyModal(true);
        setVerify(userData?.data);
        // setUser("");
        // setPwd("");
        return;
      }

      const decoded = jwtDecode<MyTokenPayload>(userData.accessToken);
      console.log(decoded);
      dispatch(
        setCredentials({
          accessToken: userData.accessToken,
          user: decoded?.UserInfo.user,
          roles: decoded?.UserInfo.roles,
          hasLocalPassword: false,
        }),
      );
      setUser("");
      setPwd("");
      router.push("/");
    } catch (err: any) {
      console.log(err);
      setErrMsg(`${err?.data?.message || "Login Failed"}`);
    }
  };

  return (
    <>
      <div className="w-screen flex flex-row p-5 items-center justify-center">
        <div className="hidden md:block w-[50%]">
          <h1>Ads Section</h1>
        </div>
        <div className=" w-100vw md:w-[50%] h-full w-[400px] md:min-w-0 flex flex-col items-center justify-center bg-gray-50 rounded-2xl drop-shadow-lg">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : (
            <>
              <h1 className="my-10 text-2xl font-bold">Log-in</h1>
              {errMsg && (
                <p ref={errorRef} className="mx-3 my-1 text-base text-red-500">
                  {errMsg}
                </p>
              )}
              <form
                className="w-full flex flex-col items-center gap-3 "
                onSubmit={handleSubmit}
              >
                <div className="group flex flex-col gap w-70">
                  <label
                    className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 ${user ? "scale-80 -translate-x-3 translate-y-0 text-gray-900" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"}`}
                    htmlFor="username"
                  >
                    Username/Email
                  </label>
                  <input
                    className="group px-3 py-2 rounded-2xl border border-gray-300"
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    ref={userRef}
                    required
                  />
                </div>
                <div className="group relative flex flex-col gap w-70">
                  <label
                    className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 ${pwd ? "scale-80 -translate-x-3 translate-y-0 text-gray-900" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500"}`}
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex flex-row">
                    <input
                      className="px-3 py-2 rounded-2xl border border-gray-300 w-70"
                      type={`${showPwd ? "text" : "password"}`}
                      id="password"
                      autoComplete="off"
                      onChange={(e) => setPwd(e.target.value)}
                      value={pwd}
                      required
                    />
                    <span
                      className="absolute right-2.5 bottom-2.5 cursor-pointer text-gray-600"
                      onClick={() => setShowPwd(!showPwd)}
                    >
                      {showPwd ? <Eye /> : <EyeOff />}
                    </span>
                  </div>
                </div>

                <div className="flex w-70 my-5 items-center justify-between">
                  <button className="px-4 py-2 bg-pink-400 text-white font-semibold rounded-3xl hover:scale-110 hover:bg-pink-500 active:bg-pink-600 active:scale-105 transition-all duration-300 cursor-pointer">
                    Log In
                  </button>
                  <Link
                    className="transition-all duration-300 hover:scale-110 hover:text-gray-700"
                    href="/forgot-pwd"
                  >
                    Forgot Password
                  </Link>
                </div>
              </form>

              <Link
                className=" transition-all duration-300 hover:scale-110 hover:text-gray-700"
                href="/register"
              >
                Don't have an Account?
              </Link>

              <div className=" flex w-75 items-center text-center before:content-[''] before:flex-1 before:border-b before:border-black after:content-[''] after:flex-1 after:border-b after:border-black my-5">
                <span className="px-3 font-semibold">OR</span>
              </div>
            </>
          )}
        </div>
      </div>
      {verifyModal ? (
        <OTPModal
          isOpen={verifyModal}
          onClose={() => setVerifyModal(false)}
          verifyData={verify}
        />
      ) : (
        ""
      )}
    </>
  );
}
