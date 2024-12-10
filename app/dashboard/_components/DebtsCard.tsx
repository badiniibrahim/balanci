/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import CountUp from "react-countup";
import { FaRegCreditCard } from "react-icons/fa";

function DebtsCard({ balance }: { balance: any }) {
  const formatter = useMemo(
    () => GetFormatterForCurrency(balance?.currency ?? "USD"),
    [balance]
  );

  return (
    <div className="h-36 text-gray-200 bg-[hsl(var(--chart-5))] w-48 p-4 rounded-xl shadow-lg">
      <button
        type="button"
        className="text-2xl rounded-full p-3 bg-[#E5FAFB] text-[hsl(var(--chart-2))] hover:shadow-md"
      >
        <FaRegCreditCard />
      </button>
      <div className="mt-3">
        <CountUp
          preserveValue
          redraw={false}
          end={balance?.debts || 0}
          decimals={2}
          formattingFn={(value) => formatter.format(value)}
          className="text-lg font-semibold"
        />
        <p className="text-sm text-white mt-1">Debts</p>
      </div>
    </div>
  );
}

export default DebtsCard;
