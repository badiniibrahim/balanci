/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DollarSign } from "lucide-react";
import React, { useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import CountUp from "react-countup";

function Balance({ balance }: { balance: any }) {
  const formatter = useMemo(
    () => GetFormatterForCurrency(balance?.currency ?? "USD"),
    [balance]
  );

  return (
    <div className="bg-[hsl(var(--chart-1))] text-gray-200 h-35 w-full lg:w-80 p-6 rounded-xl shadow-lg m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-white mb-1">Total Income</p>
          <CountUp
            preserveValue
            redraw={false}
            end={balance?.income || 0}
            decimals={2}
            formattingFn={(value) => formatter.format(value)}
            className="text-xl font-semibold"
          />
        </div>
        <button
          type="button"
          className="text-white text-2xl bg-red-500 p-3 rounded-full hover:shadow-md"
        >
          <DollarSign />
        </button>
      </div>
    </div>
  );
}

export default Balance;
