/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CountUp from "react-countup";

type ExpenseCardProps = {
  title: string;
  value: number;
  color: string;
  icon: any;
  currencyFormatter: (value: number) => string;
};

function ExpenseCard({
  title,
  value,
  color,
  icon: Icon,
  currencyFormatter,
}: ExpenseCardProps) {
  return (
    <div
      className={`h-44 text-gray-200 ${color} md:w-56 p-4 pt-9 rounded-2xl flex flex-col justify-between`}
    >
      <button
        type="button"
        className="text-2xl opacity-90 rounded-full p-4 hover:drop-shadow-xl"
      >
        <Icon />
      </button>
      <div>
        <span className="text-lg font-semibold">
          <CountUp
            preserveValue
            redraw={false}
            end={value || 0}
            decimals={2}
            formattingFn={currencyFormatter}
            className="text-2xl"
          />
        </span>
        <p className="text-sm text-white mt-1">{title}</p>
      </div>
    </div>
  );
}

export default ExpenseCard;
