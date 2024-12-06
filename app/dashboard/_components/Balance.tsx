/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DollarSign } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import CountUp from "react-countup";

function Balance({ balance }: { balance: any }) {
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(balance?.currency ?? "USD");
  }, [balance]);

  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className=" dark:text-gray-200 bg-[hsl(var(--chart-1))] h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-white">Total Income</p>
          <CountUp
            preserveValue
            redraw={false}
            end={balance?.income}
            decimal="2"
            formattingFn={formatFn}
            className="text-2xl"
          />
        </div>
        <button
          type="button"
          style={{ backgroundColor: "red" }}
          className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
        >
          <DollarSign />
        </button>
      </div>
    </div>
  );
}

export default Balance;
