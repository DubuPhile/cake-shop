import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
};

export default function loginlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
