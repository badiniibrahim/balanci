"use client";

import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import CreateIncomeDialog from "./_components/CreateIncomeDialog";
import { useQuery } from "@tanstack/react-query";
import UserIncome from "./_components/UserIncome";
import UserIncomeSkeleton from "./_components/UserIncomeSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const fetchIncome = async () => {
  const response = await fetch("/api/income", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch income");
  }
  return response.json();
};

function IncomePage() {
  const {
    data: incomes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchIncome"],
    queryFn: () => fetchIncome(),
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
        <CreateIncomeDialog
          trigger={
            <Button
              variant={"outline"}
              className="hover:bg-primary/55 hover:text-white bg-primary"
            >
              Add new income
            </Button>
          }
        />
      </div>
      <Suspense fallback={<UserIncomeSkeleton />}>
        <UserIncome incomes={incomes.incomes} currency={incomes.currency} />
      </Suspense>
    </div>
  );
}

export default IncomePage;
