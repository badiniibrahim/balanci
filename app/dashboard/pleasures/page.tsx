"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import UserIncomeSkeleton from "../income/_components/UserIncomeSkeleton";
import CreatePleasuresDialog from "./_components/CreatPleasuresDialog";
import UserPleasures from "./_components/UserPleasures";

const fetchPleasure = async () => {
  const response = await fetch("/api/pleasure", {
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

function PleasuresPage() {
  const {
    data: pleasure,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchPleasure"],
    queryFn: () => fetchPleasure(),
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
        <CreatePleasuresDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add new pleasures and reserve funds
            </Button>
          }
        />
      </div>

      <Suspense fallback={<UserIncomeSkeleton />}>
        <UserPleasures
          pleasure={pleasure.pleasure}
          currency={pleasure.currency}
        />
      </Suspense>
    </div>
  );
}

export default PleasuresPage;
