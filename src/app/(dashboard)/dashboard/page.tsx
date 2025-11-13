"use client";

import React from "react";
import DashboardLayout from "./layout";
import { Text, Card } from "@hdfclife-insurance/one-x-ui";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Text size="xl" fontWeight="semibold" className="text-primary-blue">
          Dashboard Overview
        </Text>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 shadow-sm">
            <Text size="lg" fontWeight="bold">120</Text>
            <Text size="sm" color="gray">Total Cases</Text>
          </Card>

          <Card className="p-6 shadow-sm">
            <Text size="lg" fontWeight="bold">59</Text>
            <Text size="sm" color="gray">Pending</Text>
          </Card>

          <Card className="p-6 shadow-sm">
            <Text size="lg" fontWeight="bold">35</Text>
            <Text size="sm" color="gray">Issued</Text>
          </Card>

          <Card className="p-6 shadow-sm">
            <Text size="lg" fontWeight="bold">26</Text>
            <Text size="sm" color="gray">Rejected</Text>
          </Card>
        </div>

        <Card className="p-8 shadow-sm">
          <Text size="md" fontWeight="bold" className="mb-2">
            Welcome to your dashboard
          </Text>
          <Text size="sm" color="gray">
            Choose a section from the left sidebar to get started.
          </Text>
        </Card>
      </div>
    </DashboardLayout>
  );
}
