"use client";

import DialogAction from "@/components/shared/DialogAction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { useMemo, useState } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Savings } from "@prisma/client";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "../../charges/_components/dataTable/ColumnHeader";
import { DeleteSavings } from "../_actions/deleteSavings";
import { DataTableFacetedFilter } from "../../charges/_components/dataTable/FacetedFilter";

type Props = {
  savings: Savings[];
  currency: string;
};

export function SavingsTable({ savings = [], currency }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(currency);
  }, [currency]);

  const deleteMutation = useDeleteMutation(
    "savings",
    DeleteSavings,
    "fetchSavings"
  );

  const columns: ColumnDef<Savings>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-white font-bold">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            "capitalize w-[100px] rounded-full text-center px-3 py-1 text-sm",
            row.original.type === "fixed" && "bg-green-100 text-green-600",
            row.original.type === "variable" && "bg-red-100 text-red-600"
          )}
        >
          {row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt).toLocaleDateString(
          "default",
          {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
        return <div className="text-white font-bold">{date}</div>;
      },
    },
    {
      accessorKey: "budgetAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <p className="text-white font-bold">
          {formatter.format(row.original.budgetAmount)}
        </p>
      ),
    },
    {
      accessorKey: "Actions",
      cell: ({ row }) => (
        <DialogAction
          entityName={row.original.name}
          entityId={row.original.id}
          entityType="savings"
          deleteMutation={deleteMutation}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: savings || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg text-white font-bold">Savings and Investments</h1>
        <div className="flex gap-2">
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              title="Type"
              column={table.getColumn("type")}
              options={[
                { label: "Savings", value: "saving" },
                { label: "Investments", value: "invest" },
              ]}
            />
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-white">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-white font-bold">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="p-4 text-white font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-primary/90 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-4 text-white font-bold"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-gray-500 p-4"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}