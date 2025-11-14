"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  Flex,
  Pagination,
  Checkbox,
  Text,
} from "@hdfclife-insurance/one-x-ui";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
import { IconButton } from "@hdfclife-insurance/one-x-ui";
import ClaimViewModal from "./ClaimViewModal";
import { useAppSelector } from "../../store/hooks";
import { Claim as ReduxClaim } from "../../store/slices/claimsSlice";

type Claim = ReduxClaim;
const columnHelper = createColumnHelper<Claim>();

function DashboardTable({
  filter,
  userRole = "user",
}: {
  filter?: string;
  userRole?: "user" | "admin";
}) {
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  // Local UI state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Claim | null>(null);

  // Read claims from redux only
  const reduxClaims = useAppSelector((s) => s.claims.claims);
  const claimsLoading = useAppSelector((s) => s.claims.loading);

  // Derive data (memoized) — use reduxClaims only to avoid fallback toggles
  const data = useMemo(() => {
    if (!reduxClaims || reduxClaims.length === 0) return [] as Claim[];
    // if filter is provided, apply it
    if (filter && filter !== "All" && filter !== undefined) {
      return reduxClaims.filter((c) => c.status === filter);
    }
    return reduxClaims;
  }, [reduxClaims, filter]);

  // Memoize columns so they are stable across renders
  const columns = useMemo(
    () => [
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
          return <Text size="sm" color={colorMap[status] || 'gray'}>{status}</Text>;
        }
      }),
      {
        id: "action",
        header: "Actions",
        cell: ({ row }: any) => (
          <Flex gap={2}>
            <button
              onClick={() => setSelectedCustomer(row.original)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View/Edit
            </button>
          </Flex>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  // Modal close handler — no fetch triggered here
  const handleModalClose = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="mt-4">
      <div>
        {/* Table */}
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

        {/* Pagination */}
        <Flex justify="flex-end" className="mt-3">
          <Pagination
            count={data.length}
            onPrevious={() => table.previousPage?.()}
            onNext={() => table.nextPage?.()}
            pageSize={pagination.pageSize}
            onPageChange={(details: { page: number }) => table.setPageIndex(details.page - 1)}
          />
        </Flex>
      </div>

      {/* Modal */}
      {selectedCustomer && (
        <ClaimViewModal
          claim={selectedCustomer}
          userRole={userRole}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default React.memo(DashboardTable);
