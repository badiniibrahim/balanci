/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useCallback } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import CountUp from "react-countup";
import {
  
  FaRegCreditCard,
  
} from "react-icons/fa";

function DebtsCard({ balance }: { balance: any }) {
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
      className="h-44 text-gray-200 bg-[hsl(var(--chart-5))] md:w-56  p-4 pt-9 rounded-2xl "
    >
      <button
        type="button"
        style={{
          color: "hsl(var(--chart-2))",
          backgroundColor: "#E5FAFB",
        }}
        className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl bg-[#E5FAFB]"
      >
        <FaRegCreditCard />
      </button>
      <p className="mt-3">
        <span className="text-lg font-semibold">
          <CountUp
            preserveValue
            redraw={false}
            end={balance?.debts}
            decimal="2"
            formattingFn={formatFn}
            className="text-2xl"
          />
        </span>
      </p>
      <p className="text-sm text-white  mt-1">{"Debts"}</p>
    </div>
  );
}

export default DebtsCard;
