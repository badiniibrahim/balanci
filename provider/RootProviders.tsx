/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUser } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

function RootProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkAndCreateUser();
    }
  }, [user]);

  const checkAndCreateUser = async () => {
    try {
      await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user }),
      });
    } catch (error) {
      console.error("Error while checking or creating user:", error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default RootProvider;
