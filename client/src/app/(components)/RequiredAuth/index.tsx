"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function RequiredAuth({ children, allowedRoles }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, accessToken, roles, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (!accessToken) {
      localStorage.setItem("lastPath", pathname);
      router.replace("/login");
      return;
    }

    if (
      allowedRoles &&
      roles &&
      !allowedRoles.some((role) => roles.includes(role))
    ) {
      router.replace("/unauthorized");
    }
  }, [accessToken, user, allowedRoles, router, isInitialized]);

  if (!accessToken) return null;

  return <>{children}</>;
}
