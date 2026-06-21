"use client";

import { useState } from "react";
import styles from "./index.module.css";
import Login from "../(authComponents)/Login";
import Register from "../(authComponents)/Register";
import { OTPModal, VerifyOTP } from "@/app/(components)/VerifyModal";
import { useVerifyOTPMutation } from "@/redux/features/OTPAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { setCredentials } from "@/redux/state/auth";
import { useAppDispatch } from "@/redux/store";

type UserInfo = {
  user: string;
  roles: string[];
  isAdmin: boolean;
};

export interface MyTokenPayload {
  UserInfo: UserInfo;
}

export interface Props {
  setVerifyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVerify: React.Dispatch<React.SetStateAction<VerifyOTP | undefined>>;
}

export default function NewLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = useState(false);

  const [verifyModal, setVerifyModal] = useState<boolean>(false);
  const [verify, setVerify] = useState<VerifyOTP | undefined>();

  const [verifyOtp] = useVerifyOTPMutation();

  const handleVerify = async (otp: string) => {
    if (!verify) return;

    const success = await verifyOtp({
      purpose: verify?.purpose,
      otpCode: otp,
      email: verify?.email,
    }).unwrap();

    //modal
    toast.success(`${success?.message || "Register Success!"}`, {
      style: {
        fontWeight: "600",
        color: "green",
      },
    });
    console.log(`${success?.message || "Register Success!"}`);
    router.push("/login");
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
    } catch (err) {}
    if (!verify) return;

    const success = await verifyOtp({
      purpose: verify?.purpose,
      otpCode: otp,
      email: verify?.email,
    }).unwrap();

    console.log(success);

    if (!success.accessToken) throw new Error("accessToken not found");
    const decoded = jwtDecode<MyTokenPayload>(success.accessToken);
    await dispatch(
      setCredentials({
        accessToken: success.accessToken,
        user: decoded?.UserInfo.user,
        roles: decoded?.UserInfo.roles,
      }),
    );
    toast.success("Verify Successfully!", {
      style: {
        fontWeight: "600",
        color: "green",
      },
    });
    const lastpath = localStorage.getItem("lastPath");
    router.push(lastpath || "/");
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen">
        <div
          className={`${styles.container} ${isSignUp ? styles.signUpMode : ""}`}
        >
          <div
            className={`bg-gray-50 dark:bg-gray-700 ${styles.formsContainer}`}
          >
            <div className={` ${styles.signinSignup}`}>
              <div className={`${styles.form} ${styles.signIn}`}>
                <Login setVerifyModal={setVerifyModal} setVerify={setVerify} />
              </div>
              <div className={`${styles.form} ${styles.signUp} mt-10 sm:mt-0`}>
                <Register
                  setVerifyModal={setVerifyModal}
                  setVerify={setVerify}
                />
              </div>
            </div>
          </div>
          <div className={styles.panelsContainer}>
            {" "}
            <div className={`${styles.panel} ${styles.leftPanel}`}>
              {" "}
              <div className={styles.content}>
                {" "}
                <h3>New here?</h3>{" "}
                <p>
                  Create your account in seconds and start enjoying freshly
                  baked cakes.
                </p>{" "}
                <button
                  className={`${styles.btn} ${styles.transparent}`}
                  onClick={() => setIsSignUp(true)}
                >
                  {" "}
                  Sign up{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className={`${styles.panel} ${styles.rightPanel}`}>
              {" "}
              <div className={styles.content}>
                {" "}
                <h3>Already have an Accout?</h3>{" "}
                <p>Welcome back! Sign in to continue enjoying fresh cakes.</p>{" "}
                <button
                  className={`${styles.btn} ${styles.transparent}`}
                  onClick={() => setIsSignUp(false)}
                >
                  {" "}
                  Sign in{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>
      </div>
      {verifyModal && (
        <OTPModal
          isOpen={verifyModal}
          onClose={() => setVerifyModal(false)}
          verifyData={verify}
          verifyOtp={isSignUp ? handleVerify : handleVerifyOtp}
        />
      )}
    </>
  );
}
