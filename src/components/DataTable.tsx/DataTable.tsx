/* eslint-disable @typescript-eslint/no-explicit-any */
// DataTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  RowSelectionState,
  VisibilityState,
  Table,
} from "@tanstack/react-table";
import { rankItem, RankingInfo } from "@tanstack/match-sorter-utils";
import { useState } from "react";

// Define strictly typed props for our DataTable component
// This accepts any type that extends object, making it truly generic
export type DataTableProps<TData extends object> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  showPagination?: boolean;
  showGlobalFilter?: boolean;
  showColumnVisibility?: boolean;
  enableRowSelection?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

// Explicitly type the filter function with proper generics
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string);

  // Store the ranking info
  addMeta({
    itemRank,
  } as { itemRank: RankingInfo });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// Define the table component with proper generics
export function DataTable<TData extends object>({
  data,
  columns,
  showPagination = true,
  showGlobalFilter = true,
  showColumnVisibility = true,
  enableRowSelection = false,
  enableSorting = true,
  enableFiltering = true,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: DataTableProps<TData>) {
  // State for sorting
  const [sorting, setSorting] = useState<SortingState>([]);

  // State for global filtering
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // State for column filters
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // State for row selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Initialize the table with proper generics
  const table: Table<TData> = useReactTable<TData>({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: fuzzyFilter,
    enableSorting,
    enableFilters: enableFiltering,
    enableRowSelection,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {showGlobalFilter && (
          <div>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search all columns..."
            />
          </div>
        )}

        {showColumnVisibility && (
          <div className="flex space-x-2">
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  table.getColumn(val)?.toggleVisibility();
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Toggle Columns</option>
              {table.getAllLeafColumns().map((column) => (
                <option key={column.id} value={column.id}>
                  {column.id} {column.getIsVisible() ? "👁️" : "❌"}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                table.toggleAllColumnsVisible(true);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Show All
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 border-collapse">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          enableSorting && header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                    {enableFiltering && header.column.getCanFilter() ? (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          placeholder={`Filter ${header.column.id}...`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.getIsSelected() ? "bg-blue-100" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2 items-center">
            <span className="text-sm text-gray-700">
              Page{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="font-medium">{table.getPageCount()}</span>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={`px-3 py-2 border rounded-md ${
                !table.getCanPreviousPage()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {"<<"}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`px-3 py-2 border rounded-md ${
                !table.getCanPreviousPage()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {"<"}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-2 border rounded-md ${
                !table.getCanNextPage()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {">"}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-2 border rounded-md ${
                !table.getCanNextPage()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {">>"}
            </button>
          </div>
        </div>
      )}

      {enableRowSelection && (
        <div className="mt-4">
          <div>
            Selected {Object.keys(rowSelection).length} of {data.length} rows
          </div>
        </div>
      )}
    </div>
  );
}
