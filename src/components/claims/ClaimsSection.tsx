// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Text,
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
//   ScrollArea,
// } from "@hdfclife-insurance/one-x-ui";
// import ClaimsTable from "./ClaimsTable";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { fetchClaims } from "../../store/slices/claimsSlice";

// type Props = {
//   userRole: "user" | "admin";
// };

// const TABS = ["All", "Pending", "Approved", "Rejected"] as const;

// export default function ClaimsSection({ userRole }: Props) {
//   const dispatch = useAppDispatch();
//   const claims = useAppSelector(state => state.claims.claims);
//   const loading = useAppSelector(state => state.claims.loading);
//   const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);

//   console.log("ClaimsSection - Render with:", { activeTab, userRole, claimsCount: claims.length, loading });
//   const fetchClaimsData = useCallback(() => {
//     const status = activeTab === "All" ? undefined : activeTab;
//     const userOnly = userRole === "user";

//     console.log("🔄 Fetching claims with params:", { status, userOnly, activeTab });
//     dispatch(fetchClaims({ status, userOnly }))
//       .then(() => {
//         setDataLoaded(true);
//       })
//       .catch((error) => {
//         console.error("❌ Error fetching claims:", error);
//       });
//   }, [dispatch, activeTab, userRole]); // ← Removed `loading` dependency

//   // ✅ Only fetch on mount and when tab/role changes
//   useEffect(() => {
//     fetchClaimsData();
//   }, [fetchClaimsData]);

//   // Create a stable refresh function - use refs to access current values without dependencies
//   const userRoleRef = React.useRef(userRole);
//   const activeTabRef = React.useRef(activeTab);
//   userRoleRef.current = userRole;
//   activeTabRef.current = activeTab;

//   const refreshClaims = useCallback(() => {
//     console.log("ClaimsSection - Manual refresh triggered");
//     const status = activeTabRef.current === "All" ? undefined : activeTabRef.current;
//     const userOnly = userRoleRef.current === "user";
//     dispatch(fetchClaims({ status, userOnly }));
//   }, [dispatch]); // Only dispatch as dependency for maximum stability

//   // Calculate counts for each tab - memoize to prevent recalculation on every render
//   const getTabCount = React.useMemo(() => {
//     return (tabName: string) => {
//       if (tabName === "All") return claims.length;
//       return claims.filter(claim => claim.status === tabName).length;
//     };
//   }, [claims]);

//   // Handle tab changes with debouncing
//   const handleTabChange = useCallback((details: { value: string }) => {
//     console.log("ClaimsSection - Tab change requested:", details.value);
//     if (details.value !== activeTab) {
//       setActiveTab(details.value as typeof activeTab);
//     }
//   }, [activeTab]);

//   return (
//     <div className="space-y-6">
//       <Text fontWeight="semibold" size="xl" className="text-primary-blue">
//         Claims Management
//       </Text>

//       <div className="bg-blue-100 p-2 text-xs">
//         DEBUG: Claims loaded = {claims.length} | Loading = {loading ? "Yes" : "No"}
//       </div>

//       <Tabs size="sm" value={activeTab} onValueChange={handleTabChange} variant="underline">
//         <ScrollArea>
//           <TabsList>
//             {TABS.map(tab => (
//               <TabsTrigger key={tab} value={tab}>
//                 {tab} ({getTabCount(tab)})
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </ScrollArea>

//         <TabsContent value={activeTab}>
//           <ClaimsTable
//             filter={activeTab === "All" ? undefined : activeTab}
//             userRole={userRole}
//           />
//         </TabsContent>
//       </Tabs>

//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Text,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
} from "@hdfclife-insurance/one-x-ui";

import ClaimsTable from "./ClaimsTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchClaims } from "../../store/slices/claimsSlice";

const TABS = ["All", "Pending", "Approved", "Rejected"] as const;

export default function ClaimsSection() {
  const dispatch = useAppDispatch();

  // ✔ REAL role + userId from Redux
  const role = useAppSelector((s) => s.user.role)!;
  const userId = useAppSelector((s) => s.user.userId)!;

  const claims = useAppSelector((s) => s.claims.claims);
  const loading = useAppSelector((s) => s.claims.loading);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  


  const fetchClaimsData = useCallback(() => {
    const status = activeTab === "All" ? undefined : activeTab;
    const userOnly = role === "USER"; // normal user only sees his own claims

    console.log("🔄 Fetching claims:", {
      status,
      userOnly,
      role,
      userId,
    });

    dispatch(fetchClaims({ status, userOnly, role, userId })).catch((err) =>
      console.error("❌ Error fetching claims:", err)
    );
  }, [dispatch, activeTab, role, userId]);

  if (!role || !userId) return;

  useEffect(() => {
    fetchClaimsData();
  }, [fetchClaimsData]);

  const getTabCount = useMemo(() => {
    return (tabName: string) => {
      if (tabName === "All") return claims.length;
      return claims.filter((c) => c.status === tabName).length;
    };
  }, [claims]);

  const handleTabChange = useCallback(
    (details: { value: string }) => {
      const newTab = details.value as (typeof TABS)[number];
      if (newTab !== activeTab) setActiveTab(newTab);
    },
    [activeTab]
  );

  return (
    <div className="space-y-6">
      <Text fontWeight="semibold" size="xl" className="text-primary-blue">
        Claims Management
      </Text>

      <div className="bg-blue-100 p-2 text-xs">
        DEBUG: userId = {userId} | role = {role} | Claims = {claims.length} | Loading ={" "}
        {loading ? "Yes" : "No"}
      </div>

      <Tabs size="sm" value={activeTab} onValueChange={handleTabChange} variant="underline">
        <ScrollArea>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab} ({getTabCount(tab)})
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value={activeTab}>
          <ClaimsTable
            filter={activeTab === "All" ? undefined : activeTab}
            userRole={role === "ADMIN" ? "admin" : "user"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
