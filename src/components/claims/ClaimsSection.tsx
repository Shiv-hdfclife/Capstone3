"use client";

import React, { useState, useEffect, useCallback } from "react";
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

type Props = {
  userRole: "user" | "admin";
};

const TABS = ["All", "Pending", "Approved", "Rejected"] as const;

export default function ClaimsSection({ userRole }: Props) {
  const dispatch = useAppDispatch();
  const claims = useAppSelector(state => state.claims.claims);
  const loading = useAppSelector(state => state.claims.loading);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [dataLoaded, setDataLoaded] = useState(false);

  // ✅ Fix: Remove loading from dependencies to prevent infinite loop
  const fetchClaimsData = useCallback(() => {
    const status = activeTab === "All" ? undefined : activeTab;
    const userOnly = userRole === "user";

    console.log("🔄 Fetching claims with params:", { status, userOnly, activeTab });
    dispatch(fetchClaims({ status, userOnly }))
      .then(() => {
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error("❌ Error fetching claims:", error);
      });
  }, [dispatch, activeTab, userRole]); // ← Removed `loading` dependency

  // ✅ Only fetch on mount and when tab/role changes
  useEffect(() => {
    fetchClaimsData();
  }, [fetchClaimsData]);

  // ✅ Fix: Correct Tabs onValueChange API - expects ValueChangeDetails object
  const handleTabChange = useCallback((details: { value: string }) => {
    console.log("🔄 Tab changed to:", details.value);
    setActiveTab(details.value as typeof TABS[number]);
  }, []);

  return (
    <div className="space-y-6">
      <Text fontWeight="semibold" size="xl" className="text-primary-blue">
        Claims Management
      </Text>

      <div className="bg-blue-100 p-2 text-xs">
        DEBUG: Claims loaded = {claims.length} | Loading = {loading ? "Yes" : "No"} | Tab = {activeTab} | Data Loaded = {dataLoaded ? "Yes" : "No"}
      </div>

      {loading && !dataLoaded ? (
        <div className="flex items-center justify-center p-8">
          <Text>Loading claims data...</Text>
        </div>
      ) : (
        <Tabs 
          size="sm" 
          value={activeTab} 
          onValueChange={handleTabChange} // ✅ Fixed: Pass function directly, not object
          variant="underline"
        >
          <ScrollArea>
            <TabsList>
              {TABS.map(tab => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {TABS.map(tab => (
            <TabsContent key={tab} value={tab}>
              <ClaimsTable 
                filter={tab === "All" ? "all" : tab.toLowerCase()} 
                userRole={userRole} // ✅ Fixed: Pass userRole prop
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}