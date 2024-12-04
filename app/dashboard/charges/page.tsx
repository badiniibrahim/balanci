import { Button } from "@/components/ui/button";
import React from "react";
import CreateFixedExpensesDialog from "./_components/CreateFixedExpensesDialog";

function page() {
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
    </div>
  );
}

export default page;
