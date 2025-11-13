"use client";

import React from 'react';
import { Button, Flex, Text } from "@hdfclife-insurance/one-x-ui";
import { useAuth } from '../contexts/AuthContext';

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <Text size="sm" fontWeight="bold" className="mb-2">
        Testing Mode - Switch Role
      </Text>
      <Flex gap={2}>
        <Button
          size="xs"
          variant={user?.role === 'user' ? undefined : 'secondary'}
          onClick={() => switchRole('user')}
        >
          User (Prospects + Claims)
        </Button>
        <Button
          size="xs"
          variant={user?.role === 'admin' ? undefined : 'secondary'}
          onClick={() => switchRole('admin')}
        >
          Admin (Claims Only)
        </Button>
      </Flex>
    </div>
  );
}