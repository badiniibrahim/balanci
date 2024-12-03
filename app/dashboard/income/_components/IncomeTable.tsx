import DialogAction from "@/components/shared/DialogAction";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Budget } from "@prisma/client";
import { Calendar, DollarSign } from "lucide-react";
import { DeleteIncome } from "../_actions/deleteIncome";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";

type Props = {
  budgets: Budget[];
  currency: string;
};

export function IncomeTable({ budgets = [], currency }: Props) {
  const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  const deleteMutation = useDeleteMutation("income", DeleteIncome);
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(currency);
  }, [currency]);

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <Table className="min-w-full bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <TableHeader>
          <TableRow className=" text-white">
            <TableHead className="py-3 px-5 text-left font-semibold">
              Name
            </TableHead>
            <TableHead className="py-3 px-5 text-left font-semibold">
              <Calendar className="inline-block w-4 h-4 mr-2" /> Date
            </TableHead>
            <TableHead className="py-3 px-5 text-right font-semibold">
              <DollarSign className="inline-block w-4 h-4 mr-2" /> Amount
            </TableHead>
            <TableHead className="py-3 px-5 text-center font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget) => (
            <TableRow
              key={budget.id}
              className="transition hover:bg-blue-50 hover:shadow-inner"
            >
              <TableCell className="py-3 px-5 font-medium text-gray-800">
                {budget.name}
              </TableCell>
              <TableCell className="py-3 px-5 text-gray-600">
                {new Date(budget.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-3 px-5 text-right text-gray-800 font-semibold">
                {formatter.format(budget.amount)}
              </TableCell>

              <TableCell className="py-3 px-5 text-center">
                <DialogAction
                  entityName={budget.name}
                  entityId={budget.id}
                  entityType="income"
                  deleteMutation={deleteMutation}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-primary/50">
            <TableCell
              colSpan={3}
              className="py-3 px-5 text-right font-semibold text-gray-800"
            >
              Total
            </TableCell>
            <TableCell
              colSpan={2}
              className="py-3 px-5 text-right text-blue-600 font-bold"
            >
              ${totalAmount.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
