import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import Button from "../../atoms/button";

interface ReactTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pagination?: PaginationState;
}

const ReactTable = <T,>({
  columns,
  data,
  pageCount,
  onPaginationChange,
  pagination,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    onPaginationChange,
    state: {
      pagination,
    },
  });

  return (
    <div
      className="flex flex-col justify-center items-center gap-4"
    >
      <table className="rounded-lg self-stretch">
        <thead className="border-b border-b-zinc-300">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th className="px-4 py-2 text-start" key={h.column.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              // className="even:bg-gray-200 cursor-pointer hover:bg-gray-200"
              className="border-b border-b-zinc-300"
            >
              {row.getVisibleCells().map((cell) => (
                <td className="px-4 py-4" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center gap-4 my-4">
          <Button
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
            size="small"
            className="disabled:cursor-not-allowed disabled:bg-gray-200"
            variant="outline"
          >
            Previous
          </Button>
          <p className="text-xs">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <Button
            variant="outline"
            onClick={table.nextPage}
            className="disabled:cursor-not-allowed disabled:bg-gray-200"
            size="small"
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReactTable;
