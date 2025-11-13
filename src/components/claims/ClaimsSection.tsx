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

  useEffect(() => {
    const status = activeTab === "All" ? undefined : activeTab;
    const userOnly = userRole === "user";
    dispatch(fetchClaims({ status, userOnly }));
  }, [dispatch, activeTab, userRole]);

  return (
    <div className="space-y-6">
      <Text fontWeight="semibold" size="xl" className="text-primary-blue">
        Claims Management
      </Text>

      <div className="bg-blue-100 p-2 text-xs">
        DEBUG: Claims loaded = {claims.length} | Loading = {loading ? "Yes" : "No"}
      </div>

      <Tabs size="sm" value={activeTab} onValueChange={(v)=> setActiveTab(v as any)} variant="underline">
        <ScrollArea>
          <TabsList>
            {TABS.map(tab => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
          </TabsList>
        </ScrollArea>

        {TABS.map(tab => (
          <TabsContent key={tab} value={tab}>
            <ClaimsTable filter={tab === "All" ? undefined : tab} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
