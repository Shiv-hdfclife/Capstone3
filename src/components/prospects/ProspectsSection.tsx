"use client";

import React from 'react';
import { Text } from "@hdfclife-insurance/one-x-ui";
import CustomersTable from '../customers/CustomersTable';

export default function ProspectsSection() {
  return (
    <div className="space-y-6">
      <Text
        fontWeight="semibold"
        size="xl"
        className="text-primary-blue"
      >
        Customer Management
      </Text>
      <CustomersTable />
    </div>
  );
}