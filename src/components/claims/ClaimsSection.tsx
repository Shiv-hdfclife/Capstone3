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

type Props = {
  userRole: "user" | "admin";
};

const TABS = ["All", "Pending", "Approved", "Rejected"] as const;

export default function ClaimsSection({ userRole }: Props) {
  const dispatch = useAppDispatch();
  const claims = useAppSelector((s) => s.claims.claims);
  const loading = useAppSelector((s) => s.claims.loading);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [dataLoaded, setDataLoaded] = useState(false);
  const role = localStorage.getItem("role") || "user";
  const userId = localStorage.getItem("userId") || "USER001";

  // Fetch claims when component mounts or when activeTab/userRole change.
  const fetchClaimsData = useCallback(() => {
    const status = activeTab === "All" ? undefined : activeTab;
    const userOnly = userRole === "user";

    console.log("🔄 Fetching claims with params:", {
      status,
      userOnly,
      activeTab,
    });
    dispatch(
      fetchClaims({
        status,
        userOnly,
        role: userRole,
        userId: "USER001", // Replace with actual user ID
      })
    )
      .then(() => {
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error("❌ Error fetching claims:", error);
      });
  }, [dispatch, activeTab, userRole]); // ← Removed `loading` dependency

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
      const newVal = details.value as (typeof TABS)[number];
      if (newVal !== activeTab) setActiveTab(newVal);
    },
    [activeTab]
  );

  return (
    <div className="space-y-6">
      <Text fontWeight="semibold" size="xl" className="text-primary-blue">
        Claims Management
      </Text>

      <div className="bg-blue-100 p-2 text-xs">
        DEBUG: Claims loaded = {claims.length} | Loading ={" "}
        {loading ? "Yes" : "No"} | Tab = {activeTab} | Data Loaded ={" "}
        {dataLoaded ? "Yes" : "No"}
      </div>

      <Tabs
        size="sm"
        value={activeTab}
        onValueChange={handleTabChange}
        variant="underline"
      >
        <ScrollArea>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab} ({getTabCount(tab)})
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* IMPORTANT: render only the active tab's content to avoid remounting all tables */}
        <TabsContent value={activeTab}>
          <ClaimsTable
            filter={activeTab === "All" ? undefined : activeTab}
            userRole={userRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
