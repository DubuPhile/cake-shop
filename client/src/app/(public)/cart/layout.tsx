import RequiredAuth from "@/app/(components)/RequiredAuth";

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequiredAuth>
      <main className="flex flex-col items-center">{children}</main>
    </RequiredAuth>
  );
}
