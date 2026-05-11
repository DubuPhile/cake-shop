import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h2>Main page</h2>
      <Link href="/dashboard">Dashboard</Link>
    </main>
  );
}
