"use client";

import React, { useState } from "react";
import {
  Table,
  Flex,
  Pagination,
  Checkbox,
  Text,
  Button,
  Badge
} from "@hdfclife-insurance/one-x-ui";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
import { IconButton } from "@hdfclife-insurance/one-x-ui";
import { useAppSelector } from '../../store/hooks';
import ClaimViewModal from './ClaimViewModal';

// ✅ Use the CORRECT data structure from Redux
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

interface ClaimsTableProps {
  filter?: string;
  userRole?: 'user' | 'admin';
}

const columnHelper = createColumnHelper<Claim>();
export default function ClaimsTable({ filter = "all", userRole = "user" }: ClaimsTableProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // ✅ Get REAL data from Redux store
  const claims = useAppSelector(state => state.claims.claims);
  const loading = useAppSelector(state => state.claims.loading);

  // ✅ Filter data based on the actual Redux data structure
  const filteredData = React.useMemo(() => {
    if (filter === "all" || filter === "All") return claims;
    return claims.filter((claim) => 
      claim.status.toLowerCase() === filter.toLowerCase()
    );
  }, [claims, filter]);

  // ✅ Define columns based on ACTUAL claim data structure
  const columns = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() 
              ? true 
              : table.getIsSomeRowsSelected() 
              ? "indeterminate" 
              : false
          }
          onCheckedChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox 
          checked={row.getIsSelected()} 
          onCheckedChange={row.getToggleSelectedHandler()} 
        />
      ),
    },
    columnHelper.accessor("claimId", { 
      header: "Claim ID", 
      cell: (info) => `#${info.getValue()}`,
      enableSorting: true 
    }),
    columnHelper.accessor("policyNumber", { 
      header: "Policy No", 
      cell: (info) => info.getValue(),
      enableSorting: true 
    }),
    columnHelper.accessor("claimantName", { 
      header: "Claimant Name", 
      cell: (info) => info.getValue(),
      enableSorting: true 
    }),
    columnHelper.accessor("claimAmount", { 
      header: "Claim Amount", 
      cell: (info) => `₹${info.getValue().toLocaleString()}`,
      enableSorting: true 
    }),
    columnHelper.accessor("status", { 
      header: "Status", 
      cell: (info) => {
        const status = info.getValue();
        const color = status === 'Pending' ? 'primary' : 
                     status === 'Approved' ? 'green' : 'gray';
        return <Badge color={color}>{status}</Badge>;
      },
      enableSorting: true 
    }),
    columnHelper.accessor("createdDate", { 
      header: "Date Created", 
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      enableSorting: true 
    }),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <Flex gap={2}>
          <Button
            size="xs"
            variant="secondary"
            onClick={() => setSelectedClaim(row.original)}
          >
            View Details
          </Button>
          {userRole === 'admin' && row.original.status === 'Pending' && (
            <Button
              size="xs"
              variant="primary"
              color="primary"
              onClick={() => setSelectedClaim(row.original)}
            >
              Review
            </Button>
          )}
        </Flex>
      ),
    },
  ], [userRole]);

  const table = useReactTable({
    data: filteredData, // ✅ Use actual filtered claims data
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

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Text>Loading claims...</Text>
      </div>
    );
  }

  // ✅ Show empty state
  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Text>No claims found for the selected filter.</Text>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Debug info */}
      <div className="bg-green-100 p-2 mb-4 text-xs">
        DEBUG: Showing {filteredData.length} claims | Filter: {filter} | Total Redux Claims: {claims.length}
      </div>

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
                          <IconButton 
                            variant="link" 
                            color="gray" 
                            size="xs" 
                            onClick={h.column.getToggleSortingHandler()}
                          >
                            {h.column.getIsSorted() === "asc" ? (
                              <ArrowUp />
                            ) : h.column.getIsSorted() === "desc" ? (
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
          onPrevious={() => table.previousPage()}
          onNext={() => table.nextPage()}
          pageSize={pagination.pageSize}
          onPageChange={(details: { page: number }) => table.setPageIndex(details.page - 1)}
        />
      </Flex>

      {/* Claim View Modal */}
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