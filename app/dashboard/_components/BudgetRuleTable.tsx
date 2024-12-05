/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
function BudgetRuleTable({ balance }: { balance: any }) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full border">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-4 py-2 text-left">Catégorie</TableHead>
            <TableHead className="px-4 py-2 text-left">Règle (%)</TableHead>
            <TableHead className="px-4 py-2 text-left">Suivi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="px-4 py-2">
              DÉPENSES FIXES ET VARIABLES
            </TableCell>
            <TableCell className="px-4 py-2 text-center">50,00%</TableCell>
            <TableCell className="px-4 py-2 text-center">{`${balance?.budgetRules?.actualNeedsPercentage} %`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-4 py-2">
              ÉPARGNE, INVEST & DETTES
            </TableCell>
            <TableCell className="px-4 py-2 text-center">30,00%</TableCell>
            <TableCell className="px-4 py-2 text-center">0,00%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-4 py-2">
              PLAISIRS & FONDS RÉSERVE
            </TableCell>
            <TableCell className="px-4 py-2 text-center">20,00%</TableCell>
            <TableCell className="px-4 py-2 text-center">0,00%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default BudgetRuleTable;
