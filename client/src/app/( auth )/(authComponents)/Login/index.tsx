"use client";

import Spinner from "@/app/(components)/Spinner";
import { VerifyOTP } from "@/app/(components)/VerifyModal";
import { useLoginMutation } from "@/redux/features/userAuth";
import { setCredentials } from "@/redux/state/auth";
import { useAppDispatch } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MyTokenPayload } from "../../login/page";

export interface Props {
  setVerifyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVerify: React.Dispatch<React.SetStateAction<VerifyOTP | undefined>>;
}

export default function Login({ setVerifyModal, setVerify }: Props) {
  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);

  const [errMsg, setErrMsg] = useState<string>("");

  const userRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading: LoadLogin, isSuccess }] = useLoginMutation();

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login({
        user: user,
        pwd: pwd,
      }).unwrap();

      if (userData?.message === "Verify Login First") {
        setVerifyModal(true);
        setVerify(userData?.data);
        return;
      }
      if (!userData?.accessToken) throw new Error("accessToken not found");
      const decoded = await jwtDecode<MyTokenPayload>(userData?.accessToken);

      await dispatch(
        setCredentials({
          userId: decoded.UserInfo._id,
          accessToken: userData.accessToken,
          user: decoded?.UserInfo.user,
          roles: decoded?.UserInfo.roles,
        }),
      );
      const lastpath = localStorage.getItem("lastPath");
      setUser("");
      setPwd("");
      toast.success("Login Success", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
      router.push(lastpath || "/");
    } catch (err: any) {
      setPwd("");
      console.log(err);
      toast.error(`${err?.data?.message || "Login Failed"}`, {
        style: {
          fontWeight: "600",
          color: "red",
          textAlign: "center",
        },
      });
      setErrMsg(`${err?.data?.message || "Login Failed"}`);
    }
  };

  return (
    <>
      {LoadLogin ? (
        <Spinner />
      ) : (
        <div
          className={` flex items-center justify-center transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="w-100 flex flex-col items-center justify-center">
            <h1 className="my-10 text-2xl font-bold">Login Account</h1>
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
                  className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 dark:group-focus-within:text-gray-50 ${user ? "scale-80 -translate-x-3 translate-y-0 text-gray-900 dark:text-gray-50 cursor-default" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500 cursor-text"}`}
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
                  className={`transition-all duration-300 group-focus-within:scale-80 group-focus-within:-translate-x-3 group-focus-within:translate-y-0 group-focus-within:text-gray-900 dark:group-focus-within:text-gray-50 ${pwd ? "scale-80 -translate-x-3 translate-y-0 text-gray-900 dark:text-gray-50 cursor-default" : "scale-100 translate-x-3 translate-y-8.5 text-gray-500 cursor-text"}`}
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="flex flex-row">
                  <input
                    className="px-3 py-2 rounded-2xl border border-gray-300 w-70 "
                    type={`${showPwd ? "text" : "password"}`}
                    id="password"
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

              <div className="flex w-70 my-5 items-center justify-between">
                <button className="px-4 py-2 bg-pink-400 text-white font-semibold rounded-3xl hover:-translate-y-1 hover:bg-pink-500 active:bg-pink-600 active:-translate-y-0.5 transition-all duration-500 cursor-pointer">
                  Log In
                </button>
                <Link
                  className="transition-all duration-300 hover:-translate-y-1 hover:text-gray-700 dark:hover:text-gray-200 font-semibold text-sm"
                  href="/forgot-password"
                >
                  Forgot Password
                </Link>
              </div>
            </form>

            {/* <div className=" flex w-75 items-center text-center before:content-[''] before:flex-1 before:border-b before:border-black after:content-[''] after:flex-1 after:border-b after:border-black my-5">
              <span className="px-3 font-semibold">OR</span>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
