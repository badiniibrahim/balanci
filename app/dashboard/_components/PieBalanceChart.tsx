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
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-2))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-3))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

function PieBalanceChart({ balance }: { balance: any }) {
  const chartData = [
    {
      browser: "Fixed Charges",
      visitors: balance?.expense,
      fill: "var(--color-chrome)",
    },
    {
      browser: "Variable Charges",
      visitors: balance?.variable,
      fill: "var(--color-safari)",
    },
    { browser: "firefox", visitors: 0, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 0, fill: "var(--color-edge)" },
    { browser: "other", visitors: 0, fill: "var(--color-other)" },
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
              dataKey="visitors"
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
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default PieBalanceChart;
