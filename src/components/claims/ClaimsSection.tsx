"use client";

import React, { useState, useEffect } from "react";
import {
  Text,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
} from "@hdfclife-insurance/one-x-ui";
import ClaimsTable from "./ClaimsTable";
import { useClaimsContext } from "../../contexts/ClaimsContext";

type Props = {
  userRole: "user" | "admin";
};

const TABS = ["All", "Pending", "Approved", "Rejected"] as const;

export default function ClaimsSection({ userRole }: Props) {
  const { fetchClaims, claims, loading } = useClaimsContext();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  // Debug logging
  useEffect(() => {
    console.log("ClaimsSection Debug:", {
      userRole,
      activeTab,
      claimsCount: claims.length,
      loading,
    });
  }, [userRole, activeTab, claims, loading]);

  useEffect(() => {
    // Fetch claims based on role and tab
    const status = activeTab === "All" ? undefined : activeTab;
    const userOnly = userRole === "user"; // Admin sees all, user sees only their claims

    console.log("Fetching claims with params:", { status, userOnly });
    fetchClaims({ status, userOnly });
  }, [activeTab, userRole, fetchClaims]);

  return (
    <div className="space-y-6">
      <Text fontWeight="semibold" size="xl" className="text-primary-blue">
        Claims Management
      </Text>

      {/* Debug info */}
      <div className="bg-blue-100 p-2 text-xs">
        DEBUG: Claims loaded = {claims.length} | Loading ={" "}
        {loading ? "Yes" : "No"}
      </div>

      <Tabs
        size="sm"
        value={activeTab}
        onValueChange={(value: unknown) => {
          setActiveTab(value as (typeof TABS)[number]);
        }}
        variant="underline"
      >
        <ScrollArea>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {TABS.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <ClaimsTable
              status={tab === "All" ? undefined : tab}
              userRole={userRole}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
