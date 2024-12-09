"use client";

import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import CreateFixedExpensesDialog from "./_components/CreateFixedExpensesDialog";
import { useQuery } from "@tanstack/react-query";
import UserIncomeSkeleton from "../income/_components/UserIncomeSkeleton";
import UserFixedExpenses from "./_components/UserFixedExpenses";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const fetchFixedExpenses = async () => {
  const response = await fetch("/api/charges/fixed", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Fixed Expenses");
  }
  return response.json();
};

function FixedExpensesPage() {
  const {
    data: fixedExpenses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchFixedExpenses"],
    queryFn: () => fetchFixedExpenses(),
  });

  if (isLoading) {
    return <UserIncomeSkeleton />;
  }

  if (isError && error instanceof Error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Actions */}
      <div className="flex justify-end gap-4">
        <CreateFixedExpensesDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Variable Expense
            </Button>
          }
          type="variable"
        />
        <CreateFixedExpensesDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Add Fixed Expense
            </Button>
          }
          type="fixed"
        />
      </div>

      {/* Fixed Expenses Table */}
      <Suspense fallback={<UserIncomeSkeleton />}>
        <UserFixedExpenses
          fixedExpenses={fixedExpenses.fixedExpenses}
          currency={fixedExpenses.currency}
        />
      </Suspense>
    </div>
  );
}

export default FixedExpensesPage;
