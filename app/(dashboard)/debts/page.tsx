"use client"

import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import CreateDebtsDialog from "./_components/CreateDebtsDialog";
import UserIncomeSkeleton from "../income/_components/UserIncomeSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import UserDebts from "./_components/UserDebts";

const fetchDebts = async () => {
  const response = await fetch("/api/debts", {
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

function DebtsPage() {
  const {
    data: debts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchDebts"],
    queryFn: () => fetchDebts(),
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
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-end justify-end">
        <CreateDebtsDialog
          trigger={
            <Button
              variant={"outline"}
              className="hover:bg-primary/55 hover:text-white bg-primary"
            >
              Add new debt
            </Button>
          }
        />
      </div>
      <Suspense fallback={<UserIncomeSkeleton />}>
        <UserDebts debts={debts.debts} currency={debts.currency} />
      </Suspense>
    </div>
  );
}

export default DebtsPage;
