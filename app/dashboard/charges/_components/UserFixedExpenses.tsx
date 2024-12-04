"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from "lucide-react";
import React from "react";
import { FixedExpense } from "@prisma/client";
import { FixedExpensesTable } from "./FixedExpensesTable";

type Props = {
  fixedExpenses: FixedExpense[];
  currency: string;
};

function UserFixedExpenses({ fixedExpenses, currency }: Props) {
  if (!fixedExpenses) {
    return (
      <>
        <Alert variant={"destructive"}>
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (fixedExpenses.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No Fixed Expenses created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to add your first Fixed Expenses
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-5">
        <FixedExpensesTable fixedExpenses={fixedExpenses} currency={currency} />
      </div>
    </>
  );
}

export default UserFixedExpenses;
