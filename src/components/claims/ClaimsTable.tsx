// /src/components/ClaimsTable.tsx
"use client";

import React from "react";
import {
  Table,
  Table as OTable,
  Flex,
  Pagination,
  Checkbox,
  Text,
} from "@hdfclife-insurance/one-x-ui";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
import { IconButton } from "@hdfclife-insurance/one-x-ui";

const tableData = [
  {
    rcd: "12/07/2024",
    lan: "AB2C3D4E5F6G7H8",
    memberName: "Poorva Mallesh",
    status: "Pending",
    dob: "06/08/1990",
    reason: "UW/Medical bucket",
    policyNo: "PP000095",
    sum: 85000,
  },
  {
    rcd: "01/08/2024",
    lan: "XY9Z8W7V6U5T4S3R",
    memberName: "Hemant Kumar",
    status: "Issued",
    dob: "06/08/1990",
    reason: "FR Closed",
    policyNo: "PP000357",
    sum: 72000,
  },
  {
    rcd: "02/08/2024",
    lan: "M9N8B7V6C5X4Z3Y2",
    memberName: "Tanay Seth",
    status: "Rejected",
    dob: "06/08/1990",
    reason: "FR Closed",
    policyNo: "PP000123",
    sum: 95000,
  },
];


type User = {
  rcd: string;
  lan: string;
  memberName: string;
  status: string;
  reason: string;
  policyNo: string;
  sum: number;
  dob: string;
  actions?: string;
};

const columnHelper = createColumnHelper<User>();

const defaultData = tableData as User[];

export default function DashboardTable({ filter = "all" }: { filter?: string }) {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState([]);

  const filteredData = filter === "all" ? defaultData : defaultData.filter((d) => d.status === filter);

  const columns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? "indeterminate" : false}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      ),
    },
    columnHelper.accessor("rcd", { header: "RCD", cell: (info) => info.getValue(), enableSorting: true }),
    columnHelper.accessor("lan", { header: "LAN", cell: (info) => info.getValue() }),
    columnHelper.accessor("memberName", { header: "Member Name", cell: (info) => info.getValue() }),
    columnHelper.accessor("policyNo", { header: "Policy No", cell: (info) => info.getValue() }),
    columnHelper.accessor("sum", { header: "Sum", cell: (info) => info.getValue() }),
    columnHelper.accessor("dob", { header: "DOB", cell: (info) => info.getValue() }),
    columnHelper.accessor("status", { header: "Status", cell: (info) => info.getValue() }),
    columnHelper.accessor("actions", {
      id: "action",
      header: "Actions",
      cell: () => (
        <Flex gap={2}>
          <button className="text-sm text-red-600">View</button>
          <button className="text-sm text-red-600">Edit</button>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="mt-4">
      <Table.ScrollContainer type="always">
        <Table withTableBorder>
          <Table.Head>
            {table.getHeaderGroups().map((hg, hgIdx) => (
              <Table.Row key={hgIdx}>
                {hg.headers.map((h, idx) => (
                  <Table.Th key={idx} className="!py-4 bg-indigo-50">
                    {h.isPlaceholder ? null : (
                      <Flex gap={1} align="center">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && (
                          <IconButton variant="link" color="gray" size="xs" onClick={h.column.getToggleSortingHandler()}>
                            {h.column.getIsSorted() === "asc" ? <ArrowUp /> : h.column.getIsSorted() === "desc" ? <ArrowDown /> : <ArrowsDownUp />}
                          </IconButton>
                        )}
                      </Flex>
                    )}
                  </Table.Th>
                ))}
              </Table.Row>
            ))}
          </Table.Head>
          <Table.Body>
            {table.getRowModel().rows.map((row, rIdx) => (
              <Table.Row key={rIdx}>
                {row.getVisibleCells().map((cell, cIdx) => (
                  <Table.Cell key={cIdx} className="!py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.ScrollContainer>

      <Flex justify="flex-end" className="mt-3">
        <Pagination
          count={filteredData.length}
          onPrevious={() => table.previousPage?.()}
          onNext={() => table.nextPage?.()}
          pageSize={pagination.pageSize}
          onPageChange={(details: { page: number }) => table.setPageIndex(details.page - 1)}
        />
      </Flex>
    </div>
  );
}
