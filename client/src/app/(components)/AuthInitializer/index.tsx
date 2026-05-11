"use client";

import { useEffect } from "react";
import { useRefreshMutation } from "@/redux/features/userAuth";
import { useAppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/state/auth";
import { jwtDecode } from "jwt-decode";
import { MyTokenPayload } from "@/app/( auth )/login/page";

export default function AuthInitializer() {
  const [refresh] = useRefreshMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restore = async () => {
      try {
        const result = await refresh().unwrap();

        const decoded = await jwtDecode<MyTokenPayload>(result.accessToken);
        console.log(decoded);
        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            user: decoded?.UserInfo.user,
            roles: decoded?.UserInfo.roles,
            hasLocalPassword: false,
          }),
        );
      } catch (err) {
        console.log(err);
      }
    };

    restore();
  }, [refresh, dispatch]);

  return null;
}
