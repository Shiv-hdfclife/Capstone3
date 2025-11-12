// src/contexts/ClaimsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

export type Customer = any;
export type Claim = any;

type ClaimsContextType = {
  customers: Customer[];
  claims: Claim[];
  loading: boolean;
  fetchCustomers: () => Promise<void>;
  fetchClaims: (opts?: { status?: string; userOnly?: boolean }) => Promise<void>;
  createClaim: (payload: any) => Promise<any>;
  decisionOnClaim: (id: number, decision: 'Approved'|'Rejected', note?: string) => Promise<any>;
};

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export const ClaimsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await api.fetchCustomers();
      setCustomers(res);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClaims(opts: { status?: string; userOnly?: boolean } = {}) {
    setLoading(true);
    try {
      const res = await api.fetchClaims(opts);
      setClaims(res);
    } finally {
      setLoading(false);
    }
  }

  async function createClaim(payload: any) {
    setLoading(true);
    try {
      const created = await api.createClaim(payload);
      // Add optimistically to local list
      setClaims(prev => [created, ...prev]);
      return created;
    } finally {
      setLoading(false);
    }
  }

  async function decisionOnClaim(id: number, decision: 'Approved'|'Rejected', note?: string) {
    setLoading(true);
    try {
      const res = await api.decisionOnClaim(id, { decision, note });
      // update local state
      setClaims(prev => prev.map(c => c.claimId === id ? { ...c, status: decision, adminNote: note } : c));
      return res;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    fetchCustomers();
    fetchClaims();
  }, []);

  return (
    <ClaimsContext.Provider value={{ customers, claims, loading, fetchCustomers, fetchClaims, createClaim, decisionOnClaim }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export function useClaimsContext() {
  const ctx = useContext(ClaimsContext);
  if (!ctx) throw new Error('useClaimsContext must be used within ClaimsProvider');
  return ctx;
}
