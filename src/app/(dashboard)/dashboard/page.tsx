"use client";

import React from "react";
import DashboardLayout from "./layout";
import { useAppSelector } from "../../../store/hooks";
import { Text, Card } from "@hdfclife-insurance/one-x-ui";

export default function DashboardPage() {

  const selectedSection = useAppSelector((s) => s.sidebar.selectedSection);

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <Text size="xl" fontWeight="semibold" className="text-primary-blue">
              Dashboard Overview
            </Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <Text size="lg" fontWeight="bold">120</Text>
                <Text size="sm" color="gray">Total Cases</Text>
              </Card>
              <Card className="p-6">
                <Text size="lg" fontWeight="bold">59</Text>
                <Text size="sm" color="gray">Pending</Text>
              </Card>
              <Card className="p-6">
                <Text size="lg" fontWeight="bold">35</Text>
                <Text size="sm" color="gray">Issued</Text>
              </Card>
              <Card className="p-6">
                <Text size="lg" fontWeight="bold">26</Text>
                <Text size="sm" color="gray">Rejected</Text>
              </Card>
            </div>
          </div>
        );

      case "claims":
        return <div>Claims View Here</div>;

      case "prospects":
        return <div>Prospects Table Here</div>;

      case "loaders":
        return <div>Loaders Section Here</div>;

      default:
        return <div>Choose a section</div>;
    }
  };

  return <DashboardLayout>{renderSection()}</DashboardLayout>;
}
