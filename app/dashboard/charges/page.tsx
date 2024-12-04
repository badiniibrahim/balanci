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
      <div className="flex justify-center items-center">
        <Alert variant={"destructive"}>
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-end justify-end">
        <CreateFixedExpensesDialog
          trigger={
            <Button
              variant={"outline"}
              className="hover:bg-primary/55 hover:text-white bg-primary"
            >
              Add new fixed expenses
            </Button>
          }
        />
      </div>
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
