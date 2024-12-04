"use client";

import { earningData } from "@/constants";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import Balance from "./_components/Balance";
import BalanceChart from "./_components/BalanceChart";
import PieBalanceChart from "./_components/PieBalanceChart";
import {
  LayoutDashboard,
  DollarSign,
  Shield,
  UserCircle,
  FileText,
} from "lucide-react";
import FixedExpenseCard from "./_components/FixedExpenseCard";

function DashboardPage() {
  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: () =>
      fetch("/api/states/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });

  console.log({ balance });

  return (
    <div>
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <Balance balance={balance} />
        <div className="flex m-3 flex-wrap justify-center gap-5 items-center ">
          {/*<div className="grid grid-cols-4 gap-5">
            <FixedExpenseCard balance={balance} />
          </div>*/}
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
      <div className="flex gap-10 flex-wrap justify-center">
        <BalanceChart balance={balance} />
        <div>
          <div
            className=" rounded-2xl md:w-400 p-4 m-3"
            style={{ backgroundColor: "red" }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Earnings</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">
                  $63,448.78
                </p>
                <p className="text-gray-200">Monthly revenue</p>
              </div>
            </div>

            <div className="mt-4">
              <div>SparkLine</div>
            </div>
          </div>

          <div className="dark:text-gray-200 bg-[#1a202c] rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">$43,246</p>
              <p className="text-gray-400">Yearly sales</p>
            </div>

            <PieBalanceChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
