"use client";

import { sidebarLinks } from "@/constants";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="h-screen w-72 bg-gray-800 text-white shadow-xl dark:bg-gray-900 dark:text-gray-200 p-5">
     <div className="flex items-center gap-2 justify-center">
        <h1 className="text-3xl font-semibold text-primary">Logo</h1>
        <h2 className="font-bold text-xl">Study</h2>
      </div>

      <div className="mt-12 space-y-4">
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
                <route.icon size={25}/>
                <h2>{route.label}</h2>
              </Link>
            );
          })}
      </div>
      <div className="absolute bottom-5 left-0 right-0 text-center text-xs text-gray-400">
        <p>&copy; 2024 Study App</p>
      </div>
    </div>
  );
}

export default Sidebar;
