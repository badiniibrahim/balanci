"use client";

import DashboardHeader from "@/components/shared/DashboardHeader";
import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="md:w-64 hidden md:block fixed">
        <Sidebar />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
}
