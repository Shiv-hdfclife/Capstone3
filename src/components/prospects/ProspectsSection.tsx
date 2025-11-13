"use client";

import React from 'react';
import { Text } from "@hdfclife-insurance/one-x-ui";
import CustomersTable from '../customers/CustomersTable';

export default function ProspectsSection() {
  return (
    <div className="h-full flex flex-col">
      <div className="mt-auto space-y-6">
        <Text
          fontWeight="semibold"
          size="xl"
          className="text-primary-blue"
        >
          Customer Managementerere
        </Text>
        <CustomersTable />
      </div>
    </div>
  );
}