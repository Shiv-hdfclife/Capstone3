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
