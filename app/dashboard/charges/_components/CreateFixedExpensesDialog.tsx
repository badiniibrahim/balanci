"use client";

import React, { ReactNode, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateFixedExpenses } from "../_actions/createFixedExpensesAction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar1Icon, Loader2 } from "lucide-react";
import { FixedExpensesSchema, FixedExpensesType } from "@/schema/fixedExpenses";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  trigger: ReactNode;
}

function CreateFixedExpensesDialog({ trigger }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FixedExpensesType>({
    resolver: zodResolver(FixedExpensesSchema),
    defaultValues: {
      name: "",
      budgetAmount: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateFixedExpenses,
    onSuccess: () => {
      toast.success("Fixed Expenses created", { id: "create-fixed-expenses" });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["fetchFixedExpenses"] });
    },
    onError: () => {
      toast.error("Failed to create Fixed Expenses", {
        id: "create-fixed-expenses",
      });
    },
  });

  const onSubmit = useCallback(
    (values: FixedExpensesType) => {
      toast.loading("Creating fixed expense...", {
        id: "create-fixed-expenses",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new <span className="text-primary">fixed expenses</span>
          </DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Amount
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Due date
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick date</span>
                            )}

                            <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Create"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFixedExpensesDialog;
