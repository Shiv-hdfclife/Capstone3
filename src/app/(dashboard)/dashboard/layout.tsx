import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | HDFC Life Insurance",
  description: "HDFC Life Insurance Dashboard - Manage your insurance business",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}