"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import Balance from "./_components/Balance";
import BalanceChart from "./_components/BalanceChart";
import PieBalanceChart from "./_components/PieBalanceChart";

import FixedExpenseCard from "./_components/FixedExpenseCard";
import BudgetRuleTable from "./_components/BudgetRuleTable";
import VariableExpenseCard from "./_components/VariableExpenseCard";
import RemainsBudgetCard from "./_components/RemainsBudgetCard";

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
          <div className="grid grid-cols-4 gap-5">
            <FixedExpenseCard balance={balance} />
            <VariableExpenseCard balance={balance} />
            <RemainsBudgetCard balance={balance} />
          </div>
          {/*earningData.map((item) => (
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
          ))*/}
        </div>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <BalanceChart balance={balance} />
        <div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <BudgetRuleTable balance={balance} />
          </div>

          <div className="dark:text-gray-200 bg-[#1a202c] rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <PieBalanceChart balance={balance} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
