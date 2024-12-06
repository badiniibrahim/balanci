/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BarChart } from "lucide-react";
import React, { useMemo, useCallback } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import CountUp from "react-countup";

function VariableExpenseCard({ balance }: { balance: any }) {
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
    <div
      key={"item.title"}
      className="h-44 text-gray-200 bg-[hsl(var(--chart-3))] md:w-56  p-4 pt-9 rounded-2xl "
    >
      <button
        type="button"
        style={{
          color: "hsl(var(--chart-2))",
          backgroundColor: "#E5FAFB",
        }}
        className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl bg-[#E5FAFB]"
      >
        <BarChart />
      </button>
      <p className="mt-3">
        <span className="text-lg font-semibold">
          <CountUp
            preserveValue
            redraw={false}
            end={balance?.variable}
            decimal="2"
            formattingFn={formatFn}
            className="text-2xl"
          />
        </span>
      </p>
      <p className="text-sm text-white  mt-1">{"Variable Charges"}</p>
    </div>
  );
}

export default VariableExpenseCard;
