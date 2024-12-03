import { UserButton } from "@clerk/nextjs";
import React from "react";
import ThemeModeToggle from "./ThemeModeToggle";

function DashboardHeader() {
  return (
    <div className="p-5 shadow-md flex justify-end gap-3">
      <ThemeModeToggle />
      <UserButton />
    </div>
  );
}

export default DashboardHeader;
