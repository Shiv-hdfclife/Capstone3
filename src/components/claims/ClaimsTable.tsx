"use client";

import React, { useState, useMemo } from 'react';
import {
  Button,
  Table,
  Flex,
  IconButton,
  Pagination,
  Badge
} from "@hdfclife-insurance/one-x-ui";
import {
  ArrowDown,
  ArrowUp,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  PaginationState
} from "@tanstack/react-table";
import ClaimViewModal from './ClaimViewModal';

type Claim = {
  claimId: number;
  policyNumber: string;
  claimantName: string;
  claimAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  aadharSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  createdDate: string;
  adminNote?: string;
};

type Props = {
  status?: string;
  userRole: 'user' | 'admin';
};

export default function ClaimsTable({ status, userRole }: Props) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredClaims = useMemo(() => {
    if (!status || status === 'All') return claims;
    return claims.filter((claim: Claim) =>
      claim.status.toLowerCase() === status.toLowerCase()
    );
  }, [claims, status]);
 
  const columnHelper = createColumnHelper<Claim>();

  const columns = useMemo(() => [
    columnHelper.accessor("claimId", {
      header: "Claim ID",
      cell: (info) => `#${info.getValue()}`,
      enableSorting: true,
    }),
    columnHelper.accessor("policyNumber", {
      header: "Policy Number",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimantName", {
      header: "Claimant Name",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimAmount", {
      header: "Claim Amount",
      cell: (info) => `₹${info.getValue().toLocaleString()}`,
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const colorMap: Record<string, "primary" | "gray" | "blue" | "green"> = {
          Pending: 'primary',
          Approved: 'green',
          Rejected: 'gray'
        };
        return (
          <Badge color={colorMap[status] || 'gray'}>
            {status}
          </Badge>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("createdDate", {
      header: "Created Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      enableSorting: true,
    }),
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }: any) => (
        <Button
          size="xs"
          variant="link"
          onClick={() => setSelectedClaim(row.original)}
        >
          View
        </Button>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredClaims,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <Table.ScrollContainer type="always">
        <Table withTableBorder>
          <Table.Head>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <Table.Row key={i}>
                {headerGroup.headers.map((header, i) => (
                  <Table.Th key={i} className="!py-4 bg-indigo-50">
                    {header.isPlaceholder ? null : (
                      <Flex gap={1} align="center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <IconButton
                            variant="link"
                            color="gray"
                            size="xs"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown />
                            ) : (
                              <ArrowsDownUp />
                            )}
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
            {table.getRowModel().rows.map((row, i) => (
              <Table.Row key={i}>
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <Table.Cell key={cellIndex} className="!py-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.ScrollContainer>

      <Flex justify="flex-end">
        <Pagination
          count={filteredClaims.length}
          onPrevious={() => table.previousPage()}
          onNext={() => table.nextPage()}
          pageSize={pagination.pageSize}
          onPageChange={(details) => table.setPageIndex(details.page - 1)}
        />
      </Flex>

      {selectedClaim && (
        <ClaimViewModal
          claim={selectedClaim}
          userRole={userRole}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
}