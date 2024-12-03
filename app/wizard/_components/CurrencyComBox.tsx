"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { toast } from "sonner";

export function CurrencyComBox() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null);

  const userSettings = useQuery({
    queryKey: ["userSettings"],
    queryFn: () =>
      fetch("/api/user-settings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const res = await fetch("/api/user-settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      if (!res.ok) throw new Error("Failed to update currency");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Currency updated successfully 🥳", {
        id: "update-currency",
      });
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error("Something went wrong", { id: "update-currency" });
    },
  });

  const handleSelectionOption = useCallback(
    (value: Currency | null) => {
      if (!value) {
        toast.error("Please select a currency");
        return;
      }
      toast.loading("Updating currency...", { id: "update-currency" });
      mutation.mutate(value.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between items-center bg-white border-gray-300 text-gray-800" // Change text color here
              disabled={mutation.isPending}
            >
              {selectedOption ? (
                <>
                  <span>{selectedOption.label}</span>
                  <span className="text-gray-500">{selectedOption.value}</span>
                </>
              ) : (
                <>Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList
              setOpen={setOpen}
              setSelectedOption={handleSelectionOption}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between items-center bg-white border-gray-300 text-gray-800" // Text color updated
            disabled={mutation.isPending}
          >
            {selectedOption ? (
              <>
                <span className="font-medium">{selectedOption.label}</span>
                <span className="text-gray-500">{selectedOption.value}</span>
              </>
            ) : (
              <>Set currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-gray-50 border-t rounded-t-xl shadow-lg">
          <div className="mt-4 p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Select Currency
            </h2>
            <OptionList
              setOpen={setOpen}
              setSelectedOption={handleSelectionOption}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command className="bg-white">
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
