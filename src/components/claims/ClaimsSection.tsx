"use client";

import React, { useState, useEffect } from 'react';
import {
  Text,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea
} from "@hdfclife-insurance/one-x-ui";
import ClaimsTable from './ClaimsTable';
import { useClaimsContext } from '../../contexts/ClaimsContext';

type Props = {
  userRole: 'user' | 'admin';
};

const TABS = ['All', 'Pending', 'Approved', 'Rejected'] as const;


export default function ClaimsSection({ userRole }: Props) {
  const { fetchClaims } = useClaimsContext();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');

  useEffect(() => {
    // Fetch claims based on role and tab
    const status = activeTab === 'All' ? undefined : activeTab;
    const userOnly = userRole === 'user'; // Admin sees all, user sees only their claims
    fetchClaims({ status, userOnly });
  }, [activeTab, userRole, fetchClaims]);

  return (
    <div className="space-y-6">
      <Text
        fontWeight="semibold"
        size="xl"
        className="text-primary-blue"
      >
        Claims Management
      </Text>
      
      <Tabs 
        size="sm" 
        value={activeTab} 
        onValueChange={(details) => setActiveTab(details.value as typeof TABS[number])}
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
              status={tab === 'All' ? undefined : tab}
              userRole={userRole}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}