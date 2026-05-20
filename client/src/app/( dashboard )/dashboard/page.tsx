import { Metadata } from "next";
import Navbar from "../(dashboardComponents)/NavbarDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Metrics",
};

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <h2>Dashboard</h2>
    </div>
  );
}
