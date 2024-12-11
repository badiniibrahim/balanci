"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaPiggyBank, FaRegCreditCard, FaGlassCheers } from "react-icons/fa";
import { CreditCard, BarChart } from "lucide-react";

import { GetFormatterForCurrency } from "@/lib/helpers";
import ExpenseCard from "../_components/ExpenseCard";
import Balance from "../_components/Balance";
import BalanceChart from "../_components/BalanceChart";
import BudgetRuleTable from "../_components/BudgetRuleTable";
import PieBalanceChart from "../_components/PieBalanceChart";

function DashboardPage() {
  const {
    data: balance,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const response = await fetch("/api/states/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch balance data");
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  const formatter = GetFormatterForCurrency(balance?.currency ?? "USD");

  console.log({ balance });

  const cardsConfig = [
    {
      title: "Remains to Budget",
      value: balance?.remainsBudget,
      color: "bg-[#1a202c]",
      icon: BarChart,
    },
    {
      title: "Fixed Charges",
      value: balance?.expense,
      color: "bg-[hsl(var(--chart-2))]",
      icon: CreditCard,
    },
    {
      title: "Variable Charges",
      value: balance?.variable,
      color: "bg-[hsl(var(--chart-3))]",
      icon: BarChart,
    },
    {
      title: "Savings and Investments",
      value: balance?.savings,
      color: "bg-[hsl(var(--chart-4))]",
      icon: FaPiggyBank,
    },
    {
      title: "Debts",
      value: balance?.debts,
      color: "bg-[hsl(var(--chart-5))]",
      icon: FaRegCreditCard,
    },
    {
      title: "Pleasure",
      value: balance?.pleasure,
      color: "bg-[hsl(var(--chart-6))]",
      icon: FaGlassCheers,
    },
  ];

  return (
    <div className="p-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6">
        <Balance balance={balance} />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {cardsConfig.map((card, index) => (
            <ExpenseCard
              key={index}
              title={card.title}
              value={card.value}
              color={card.color}
              icon={card.icon}
              currencyFormatter={formatter.format}
            />
          ))}
        </div>
      </div>

      {/* Charts and Table Section */}
      <div className="flex flex-wrap lg:flex-nowrap ml-[98px] space-x-8 gap-6">
        <BalanceChart balance={balance} />
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <BudgetRuleTable balance={balance} />
          </div>
          <div className="dark:text-gray-200 bg-[#1a202c] rounded-2xl p-6 flex justify-center items-center">
            <PieBalanceChart balance={balance} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
