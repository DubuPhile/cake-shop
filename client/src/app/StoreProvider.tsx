"use client";

import StoreProvider from "@/redux/store";
import AuthInitializer from "./(components)/AuthInitializer";

export default function Store({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreProvider>
        <AuthInitializer />
        {children}
      </StoreProvider>
    </>
  );
}
