/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  budget: {
    label: "budget",
  },
  fixedCharges: {
    label: "Fixed Charges",
    color: "hsl(var(--chart-2))",
  },
  variableCharges: {
    label: "Variable Charges",
    color: "hsl(var(--chart-3))",
  },
  savings: {
    label: "Savings and Investing",
    color: "hsl(var(--chart-4))",
  },
  debts: {
    label: "Debts",
    color: "hsl(var(--chart-5))",
  },
  pleasure: {
    label: "Pleasure",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

function PieBalanceChart({ balance }: { balance: any }) {
  const chartData = [
    {
      browser: "Fixed Charges",
      budget: balance?.expense,
      fill: "var(--color-fixedCharges)",
    },
    {
      browser: "Variable Charges",
      budget: balance?.variable,
      fill: "var(--color-variableCharges)",
    },
    {
      browser: "Savings and Investing",
      budget: balance?.savings,
      fill: "var(--color-savings)",
    },
    { browser: "Debts", budget: balance?.debts, fill: "var(--color-debts)" },
    {
      browser: "pleasure",
      budget: balance?.pleasure,
      fill: "var(--color-pleasure)",
    },
  ];
  return (
    <Card className="flex flex-col bg-[#1a202c] border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Mon Budget en % </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="budget"
              nameKey="browser"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default PieBalanceChart;
