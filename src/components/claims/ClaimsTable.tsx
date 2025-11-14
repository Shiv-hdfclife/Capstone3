// // /src/components/ClaimsTable.tsx
// "use client";

// import React from "react";
// import { useState } from "react";
// import {
//   Table,
//   Table as OTable,
//   Flex,
//   Pagination,
//   Checkbox,
//   Text,
// } from "@hdfclife-insurance/one-x-ui";
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
// import { IconButton } from "@hdfclife-insurance/one-x-ui";
// import ClaimViewModal from "./ClaimViewModal";
// import { useAppSelector, useAppDispatch } from "../../store/hooks";
// import { Claim as ReduxClaim, fetchClaims } from "../../store/slices/claimsSlice";

// const tableData = [
//   {
//     userId: "1",
//     claimId: 22,
//     policyNumber: "ACNKW112",
//     status: "Pending" as const,
//     panSubmitted: true,
//     aadharSubmitted: true,
//     deathCertificateSubmitted: true,
//     claimAmount: 85000,
//     claimantName: "John Doe",
//     createdDate: "2024-01-15",
//   },
//   {
//     userId: "2",
//     claimId: 23,
//     policyNumber: "ACNKW113",
//     status: "Approved" as const,
//     panSubmitted: true,
//     aadharSubmitted: true,
//     deathCertificateSubmitted: true,
//     claimAmount: 150000,
//     claimantName: "Jane Smith",
//     createdDate: "2024-01-10",
//   },
//   {
//     userId: "3",
//     claimId: 24,
//     policyNumber: "ACNKW114",
//     status: "Rejected" as const,
//     panSubmitted: false,
//     aadharSubmitted: true,
//     deathCertificateSubmitted: false,
//     claimAmount: 75000,
//     claimantName: "Bob Johnson",
//     createdDate: "2024-01-05",
//   },
//   {
//     userId: "4",
//     claimId: 25,
//     policyNumber: "ACNKW115",
//     status: "Pending" as const,
//     panSubmitted: true,
//     aadharSubmitted: false,
//     deathCertificateSubmitted: true,
//     claimAmount: 200000,
//     claimantName: "Alice Brown",
//     createdDate: "2024-01-20",
//   },
// ];

// // Use the Redux Claim type for consistency
// type Claim = ReduxClaim;

// const columnHelper = createColumnHelper<Claim>();

// const defaultData = tableData as Claim[];

// function DashboardTable({
//   filter,
//   userRole = "user",
//   onRefresh
// }: {
//   filter?: string;
//   userRole?: "user" | "admin";
//   onRefresh?: () => void;
// }) {
//   // Add render tracking
//   const renderCount = React.useRef(0);
//   renderCount.current += 1;

//   console.log(`🔄 ClaimsTable - Render #${renderCount.current}`, {
//     filter,
//     userRole,
//     hasOnRefresh: !!onRefresh
//   });
//   const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
//   const [sorting, setSorting] = React.useState<any[]>([]);
//   const [selectedCustomer, setSelectedCustomer] = useState<Claim | null>(null);

//   const dispatch = useAppDispatch();

//   // Get claims from Redux store, fallback to local data if empty
//   const reduxClaims = useAppSelector(state => state.claims.claims);
//   const claimsLoading = useAppSelector(state => state.claims.loading);

//   // Use Redux data if available, otherwise fallback to local tableData
//   const allClaims = reduxClaims.length > 0 ? reduxClaims : defaultData;

//   console.log("ClaimsTable - Received filter:", filter);
//   console.log("ClaimsTable - User role:", userRole);
//   console.log("ClaimsTable - Redux claims:", reduxClaims);
//   console.log("ClaimsTable - Using claims:", allClaims);

//   // Filter data based on the selected tab
//   let filteredData = allClaims;
//   if (filter && filter !== "All") {
//     filteredData = allClaims.filter((claim) => claim.status === filter);
//   }

//   console.log("ClaimsTable - Filtered data:", filteredData);
//   console.log(`ClaimsTable - Filter "${filter}" resulted in ${filteredData.length} claims`);

//   // Handle modal close and refresh data
//   const handleModalClose = () => {
//     console.log("ClaimsTable - Modal closing");
//     setSelectedCustomer(null);
//     // Only refresh if onRefresh is provided and we're not already loading
//     if (onRefresh && !claimsLoading) {
//       console.log("ClaimsTable - Triggering refresh via onRefresh prop");
//       onRefresh();
//     }
//   };

//   const columns = [
//     {
//       id: "select",
//       header: ({ table }: any) => (
//         <Checkbox
//           checked={table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? "indeterminate" : false}
//           onChange={table.getToggleAllRowsSelectedHandler()}
//         />
//       ),
//       cell: ({ row }: any) => (
//         <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
//       ),
//     },
//     columnHelper.accessor("claimId", { header: "Claim ID", cell: (info) => info.getValue(), enableSorting: true }),
//     columnHelper.accessor("policyNumber", { header: "Policy No", cell: (info) => info.getValue() }),
//     columnHelper.accessor("claimAmount", {
//       header: "Claim Amount",
//       cell: (info) => `₹${info.getValue().toLocaleString()}`,
//       enableSorting: true
//     }),
//     columnHelper.accessor("aadharSubmitted", {
//       header: "Aadhar",
//       cell: (info) => (
//         <Text size="sm" color={info.getValue() ? "green" : "red"}>
//           {info.getValue() ? "✓ Submitted" : "✗ Not Submitted"}
//         </Text>
//       )
//     }),
//     columnHelper.accessor("panSubmitted", {
//       header: "PAN",
//       cell: (info) => (
//         <Text size="sm" color={info.getValue() ? "green" : "red"}>
//           {info.getValue() ? "✓ Submitted" : "✗ Not Submitted"}
//         </Text>
//       )
//     }),
//     columnHelper.accessor("deathCertificateSubmitted", {
//       header: "Death Certificate",
//       cell: (info) => (
//         <Text size="sm" color={info.getValue() ? "green" : "red"}>
//           {info.getValue() ? "✓ Submitted" : "✗ Not Submitted"}
//         </Text>
//       )
//     }),
//     columnHelper.accessor("status", {
//       header: "Status",
//       cell: (info) => {
//         const status = info.getValue();
//         const colorMap: Record<string, string> = {
//           'Pending': 'yellow',
//           'Approved': 'green',
//           'Rejected': 'red'
//         };
//         return (
//           <Text size="sm" color={colorMap[status] || 'gray'}>
//             {status}
//           </Text>
//         );
//       }
//     }),
//     {
//       id: "action",
//       header: "Actions",
//       cell: ({ row }: any) => (
//         <Flex gap={2}>
//           <button onClick={() => {
//             console.log("This claim section was clicked");
//             setSelectedCustomer(row.original)
//           }
//           }
//             className="text-sm text-blue-600 hover:text-blue-800 underline">View/Edit
//           </button>
//         </Flex>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     state: {
//       pagination,
//       sorting
//     },
//     onPaginationChange: setPagination,
//     onSortingChange: setSorting,
//   });

//   return (
//     <div className="mt-4">
//       <Table.ScrollContainer type="always">
//         <Table withTableBorder>
//           <Table.Head>
//             {table.getHeaderGroups().map((hg, hgIdx) => (
//               <Table.Row key={hgIdx}>
//                 {hg.headers.map((h, idx) => (
//                   <Table.Th key={idx} className="!py-4 bg-indigo-50">
//                     {h.isPlaceholder ? null : (
//                       <Flex gap={1} align="center">
//                         {flexRender(h.column.columnDef.header, h.getContext())}
//                         {h.column.getCanSort() && (
//                           <IconButton variant="link" color="gray" size="xs" onClick={h.column.getToggleSortingHandler()}>
//                             {h.column.getIsSorted() === "asc" ? <ArrowUp /> : h.column.getIsSorted() === "desc" ? <ArrowDown /> : <ArrowsDownUp />}
//                           </IconButton>
//                         )}
//                       </Flex>
//                     )}
//                   </Table.Th>
//                 ))}
//               </Table.Row>
//             ))}
//           </Table.Head>
//           <Table.Body>
//             {table.getRowModel().rows.map((row, rIdx) => (
//               <Table.Row key={rIdx}>
//                 {row.getVisibleCells().map((cell, cIdx) => (
//                   <Table.Cell key={cIdx} className="!py-4">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </Table.Cell>
//                 ))}
//               </Table.Row>
//             ))}
//           </Table.Body>
//         </Table>
//       </Table.ScrollContainer>

//       <Flex justify="flex-end" className="mt-3">
//         <Pagination
//           count={filteredData.length}
//           onPrevious={() => table.previousPage?.()}
//           onNext={() => table.nextPage?.()}
//           pageSize={pagination.pageSize}
//           onPageChange={(details: { page: number }) => table.setPageIndex(details.page - 1)}
//         />
//       </Flex>

//       {
//         selectedCustomer && (
//           <ClaimViewModal
//             claim={selectedCustomer}
//             userRole={userRole}
//             onClose={handleModalClose} />
//         )
//       }
//     </div>

//   );
// }

// export default React.memo(DashboardTable);



// /src/components/ClaimsTable.tsx
"use client";

import React, { useMemo, useState } from "react";
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
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
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
