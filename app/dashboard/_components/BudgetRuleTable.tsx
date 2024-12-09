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
      <Table className="w-full border-collapse border border-muted rounded-md shadow-sm">
        <TableHeader>
          <TableRow className="bg-muted/20">
            <TableHead className="px-4 py-3 text-left font-semibold text-sm uppercase text-muted-foreground">
              Catégorie
            </TableHead>
            <TableHead className="px-4 py-3 text-center font-semibold text-sm uppercase text-muted-foreground">
              Règle (%)
            </TableHead>
            <TableHead className="px-4 py-3 text-center font-semibold text-sm uppercase text-muted-foreground">
              Suivi (%)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Ligne 1 */}
          <TableRow className="hover:bg-muted/10 transition">
            <TableCell className="px-4 py-3 text-sm font-medium text-primary">
              Dépenses Fixes et Variables
            </TableCell>
            <TableCell className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
              50,00%
            </TableCell>
            <TableCell className="px-4 py-3 text-center text-sm font-medium text-emerald-500">
              {balance?.budgetRules?.actualNeedsPercentage ?? "0,00"} %
            </TableCell>
          </TableRow>
          {/* Ligne 2 */}
          <TableRow className="hover:bg-muted/10 transition">
            <TableCell className="px-4 py-3 text-sm font-medium text-primary">
              Épargne, Invest & Dettes
            </TableCell>
            <TableCell className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
              30,00%
            </TableCell>
            <TableCell className="px-4 py-3 text-center text-sm font-medium text-emerald-500">
              0,00%
            </TableCell>
          </TableRow>
          {/* Ligne 3 */}
          <TableRow className="hover:bg-muted/10 transition">
            <TableCell className="px-4 py-3 text-sm font-medium text-primary">
              Plaisirs & Fonds Réserve
            </TableCell>
            <TableCell className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
              20,00%
            </TableCell>
            <TableCell className="px-4 py-3 text-center text-sm font-medium text-emerald-500">
              0,00%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default BudgetRuleTable;
