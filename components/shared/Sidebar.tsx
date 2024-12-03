"use client";

import { sidebarLinks } from "@/constants";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="h-screen shadow-md dark:shadow-md p-5">
      <div className="flex items-center gap-2 justify-center">
        <h1>Logo</h1>
        <h2 className="font-bold text-lg">Study</h2>
      </div>

      <div className="mt-10">
        <div className="mt-10">
          {sidebarLinks.map((route, index) => {
            const isActive =
              pathname === route.route || pathname.startsWith(`${route}/`);

            return (
              <Link
                href={route.route}
                key={index}
                className={cn(
                  "flex items-center gap-5 p-3 hover:bg-primary/10 rounded-lg cursor-pointer mt-3",
                  {
                    "bg-primary/65": isActive,
                  }
                )}
              >
                <route.icon />
                <h2>{route.label}</h2>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
