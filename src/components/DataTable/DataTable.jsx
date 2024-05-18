"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { DataTablePagination } from "./DataTablePagination";
import { EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import UniversityForm from "../Forms/UniversityForm";

// Function to generate column definitions dynamically
function generateColumns(data, handleEdit) {
  const sample = data[0] || {};
  return Object.keys(sample)
    .map((key) => {
      if (key === "logo") {
        return {
          accessorKey: key,
          header: "Logo",
          cell: ({ row }) => (
            <Image
              src={row.getValue(key) || "https://github.com/cpp.png"}
              alt="logo"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          ),
        };
      } else if (key === "status") {
        return {
          accessorKey: key,
          header: "Status",
          cell: ({ row }) => (
            <span
              className={`p-1 px-2 text-xs capitalize ${
                row.getValue(key).toLowerCase() === "active"
                  ? "bg-green-200/90 text-green-800"
                  : "bg-red-200/90 text-red-800"
              } rounded-xl font-semibold`}
            >
              {row.getValue(key)}
            </span>
          ),
        };
      }
      return {
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      };
    })
    .concat({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <EyeOpenIcon className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
          <Pencil1Icon
            className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer"
            onClick={() => handleEdit(row.original)}
          />
          <TrashIcon className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer" />
        </div>
      ),
    });
}

function DataTable({ data, entity }) {
  const columns = generateColumns(data, handleEdit);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    state: { pagination, columnFilters },
  });

  function handleEdit(rowData) {
    setSelectedData(rowData);
    setDialogOpen(true);
  }

  return (
    <div className="bg-white p-6 mt-8 rounded-md shadow-md">
      <div className="flex items-center mb-4">
        <Input
          placeholder="Filter name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-bold">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="capitalize font-medium text-gray-900"
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[700px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-semibold mb-4 capitalize">
              Edit Existing {entity}
            </DialogTitle>
            {entity === "university" && (
              <UniversityForm
                onDialogOpenChange={setDialogOpen}
                data={selectedData}
              />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataTable;
