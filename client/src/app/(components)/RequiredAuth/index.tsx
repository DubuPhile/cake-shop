"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function RequiredAuth({ children, allowedRoles }: Props) {
  const router = useRouter();

  const { user, token, roles } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
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
  }, [token, user, allowedRoles, router]);

  if (!token) return null;

  return <>{children}</>;
}
