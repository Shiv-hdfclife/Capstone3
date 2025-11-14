"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Table,
  Flex,
  IconButton,
  Checkbox,
  Pagination
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCustomers } from '../../store/slices/customersSlice';
import RaiseClaimModal from './RaiseClaimModal';

type Customer = {
  policyId: number;
  policyNumber: string;
  holderName: string;
  coverageAmount: number;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
};

export default function CustomersTable() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(state => state.cusstomers.customers);
  const loading = useAppSelector(state => state.cusstomers.loading);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const columnHelper = createColumnHelper<Customer>();

  const columns = useMemo(() => [
    columnHelper.accessor("policyNumber", {
      header: "Policy No",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("holderName", {
      header: "Customer Name",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("coverageAmount", {
      header: "Coverage Amount",
      cell: (info) => `₹${info.getValue().toLocaleString()}`,
      enableSorting: true,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("active", {
      header: "Status",
      cell: (info) => (
        <span className={info.getValue() ? "text-green-600" : "text-red-600"}>
          {info.getValue() ? "Active" : "Inactive"}
        </span>
      ),
      enableSorting: true,
    }),
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }: any) => (
        <Button
          size="xs"
          variant="primary"
          color="primary"
          onClick={() => {
            console.log("This button was clicked");
            setSelectedCustomer(row.original)
          }
          }
        >
          Raise Claim
        </Button>
      ),
    },
  ], []);

  const table = useReactTable({
    data: customers,
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

  if (loading) {
    return <div>Loading customers...</div>;
  }

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
          count={customers.length}
          onPrevious={() => table.previousPage()}
          onNext={() => table.nextPage()}
          pageSize={pagination.pageSize}
          onPageChange={(details) => table.setPageIndex(details.page - 1)}
        />
      </Flex>

      {selectedCustomer && (
        <RaiseClaimModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}