"use client";

import React, { Suspense } from "react";
import CreateSavingsDialog from "./_components/createSavingsDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import UserIncomeSkeleton from "../income/_components/UserIncomeSkeleton";
import UserSavings from "./_components/UserSavings";

const fetchSavings = async () => {
  const response = await fetch("/api/savings", {
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

function SavingsPage() {
  const {
    data: savings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchSavings"],
    queryFn: () => fetchSavings(),
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
      <div className="flex justify-end gap-4">
        <CreateSavingsDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add new savings
            </Button>
          }
          type="saving"
        />
        <CreateSavingsDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Add new Investments
            </Button>
          }
          type="invest"
        />
      </div>

      <Suspense fallback={<UserIncomeSkeleton />}>
        <UserSavings savings={savings.savings} currency={savings.currency} />
      </Suspense>
    </div>
  );
}

export default SavingsPage;
