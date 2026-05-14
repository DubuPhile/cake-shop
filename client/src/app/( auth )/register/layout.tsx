import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an Account",
};

export default function registerlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
