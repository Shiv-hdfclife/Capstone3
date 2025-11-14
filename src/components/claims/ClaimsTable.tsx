// /src/components/ClaimsTable.tsx
"use client";

import React from "react";
import { useState } from "react";
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
import ClaimViewModal from "./ClaimViewModal";

const tableData = [
  {
    userId: 1,
    claimId: 22,
    policyNumber: "ACNKW112",
    status: "Pending",
    panSubmitted: true,
    aadharSubmitted: true,
    deathCertificateSubmitted: true,
    claimAmount: 85000,
  },
  {
    userId: 2,
    claimId: 23,
    policyNumber: "ACNKW113",
    status: "Approved",
    panSubmitted: true,
    aadharSubmitted: true,
    deathCertificateSubmitted: true,
    claimAmount: 150000,
  },
  {
    userId: 3,
    claimId: 24,
    policyNumber: "ACNKW114",
    status: "Rejected",
    panSubmitted: false,
    aadharSubmitted: true,
    deathCertificateSubmitted: false,
    claimAmount: 75000,
  },
  {
    userId: 4,
    claimId: 25,
    policyNumber: "ACNKW115",
    status: "Pending",
    panSubmitted: true,
    aadharSubmitted: false,
    deathCertificateSubmitted: true,
    claimAmount: 200000,
  },
];


type Claim = {
  userId: number;
  claimId: number;
  policyNumber: string;
  claimAmount: number;
  aadharSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const columnHelper = createColumnHelper<Claim>();

const defaultData = tableData as Claim[];
console.log("Default Data:", defaultData);

export default function DashboardTable({ filter }: { filter?: string }) {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Claim | null>(null);

  // console.log("ClaimsTable - Received filter:", filter);
  // console.log("ClaimsTable - Default data:", defaultData);

  const filteredData = !filter || filter === "All" ? defaultData : defaultData.filter((d) => d.status === filter);

  // console.log("ClaimsTable - Filtered data:", filteredData);

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
    columnHelper.accessor("claimId", { header: "Claim ID", cell: (info) => info.getValue(), enableSorting: true }),
    columnHelper.accessor("policyNumber", { header: "Policy No", cell: (info) => info.getValue() }),
    columnHelper.accessor("claimAmount", {
      header: "Claim Amount",
      cell: (info) => `₹${info.getValue().toLocaleString()}`,
      enableSorting: true
    }),
    columnHelper.accessor("aadharSubmitted", {
      header: "Aadhar",
      cell: (info) => (
        <Text size="sm" color={info.getValue() ? "green" : "red"}>
          {info.getValue() ? "✓ Submitted" : "✗ Not Submitted"}
        </Text>
      )
    }),
    columnHelper.accessor("panSubmitted", {
      header: "PAN",
      cell: (info) => (
        <Text size="sm" color={info.getValue() ? "green" : "red"}>
          {info.getValue() ? "✓ Submitted" : "✗ Not Submitted"}
        </Text>
      )
    }),
    columnHelper.accessor("deathCertificateSubmitted", {
      header: "Death Certificate",
      cell: (info) => (
        <Text size="sm" color={info.getValue() ? "green" : "red"}>
          {info.getValue() ? "✓ Submitted" : "✗ Not Submitted"}
        </Text>
      )
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const colorMap: Record<string, string> = {
          'Pending': 'yellow',
          'Approved': 'green',
          'Rejected': 'red'
        };
        return (
          <Text size="sm" color={colorMap[status] || 'gray'}>
            {status}
          </Text>
        );
      }
    }),
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => (
        <Flex gap={2}>
          <button onClick={() => {
            console.log("This claim section was clicked");
            setSelectedCustomer(row.original)
          }
          }
            className="text-sm text-blue-600 hover:text-blue-800 underline">View/Edit
          </button>
        </Flex>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
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

      {
        selectedCustomer && (
          <ClaimViewModal
            claim={selectedCustomer}
            userRole="admin"
            onClose={() => setSelectedCustomer(null)} />
        )
      }
    </div>

  );
}
