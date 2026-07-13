import { Metadata } from "next";
import TotalUser from "../(dashboardComponents)/TotalUser";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Metrics",
};

export default function Dashboard() {
  return (
    <div>
      <TotalUser />
    </div>
  );
}
