import React from "react";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Total Income",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Fixed Charges",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Variable Charges",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Savings and Investing",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Refund",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

function BalanceChart({
  balance,
}: {
  balance: { income: number; expense: number; variable: number, savings:number };
}) {
  const chartData = [
    {
      browser: "chrome",
      visitors: balance?.income,
      fill: "var(--color-chrome)",
    },
    {
      browser: "safari",
      visitors: balance?.expense,
      fill: "var(--color-safari)",
    },
    {
      browser: "firefox",
      visitors: balance?.variable,
      fill: "var(--color-firefox)",
    },
    { browser: "edge", visitors: balance?.savings, fill: "var(--color-edge)" },
    { browser: "other", visitors: 0, fill: "var(--color-other)" },
  ];

  return (
    <div className="flex gap-10 flex-wrap justify-center">
      <div className="dark:text-gray-200 bg-[#1a202c] m-3 p-4 rounded-2xl md:w-780 h-[500px]">
        <div className="w-full h-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              width={700}
              height={400}
              data={chartData}
              className="w-full h-full"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="browser"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="visitors"
                strokeWidth={2}
                radius={8}
                activeIndex={2}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

export default BalanceChart;
