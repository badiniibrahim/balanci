import React from "react";
import Overview from "./_components/Overview";
import { UserSettings } from "@prisma/client";
import { earningData } from "@/constants";

import Balance from "./_components/Balance";

function DashboardPage({ userSettings }: { userSettings: UserSettings }) {
  return (
    <div>
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <Balance />
        <div className="flex m-3 flex-wrap justify-center gap-5 items-center ">
          {earningData.map((item) => (
            <div
              key={item.title}
              className="h-44 text-gray-200 bg-[#1a202c] md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{
                  color: item.iconColor,
                  backgroundColor: item.iconBg,
                }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <item.icon />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
