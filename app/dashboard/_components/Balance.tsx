"use client";

import { DollarSign } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetFormatterForCurrency } from "@/lib/helpers";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import CountUp from "react-countup";

function Balance() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: () =>
      fetch("/api/states/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });

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
    <div className=" dark:text-gray-200 bg-[#1a202c] h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
      <SkeletonWrapper isLoading={isLoading}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-400">Total Income</p>
            <CountUp
              preserveValue
              redraw={false}
              end={balance?.total}
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
      </SkeletonWrapper>
    </div>
  );
}

export default Balance;
