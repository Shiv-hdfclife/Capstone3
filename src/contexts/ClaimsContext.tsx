"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

export type Customer = {
  policyId: number;
  policyNumber: string;
  holderName: string;
  coverageAmount: number;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
  userId: string;
};

export type Claim = {
  claimId: number;
  policyNumber: string;
  claimantName: string;
  claimAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  aadharSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  createdDate: string;
  adminNote?: string;
  userId: string;
};

type ClaimsContextType = {
  customers: Customer[];
  claims: Claim[];
  loading: boolean;
  fetchCustomers: () => Promise<void>;
  fetchClaims: (opts?: { status?: string; userOnly?: boolean }) => Promise<void>;
  createClaim: (payload: any) => Promise<any>;
  decisionOnClaim: (id: number, decision: 'Approved'|'Rejected', note?: string) => Promise<any>;
  raiseClaim: (claimData: {
    policyId: number;
    claimAmount: number;
    aadharSubmitted: boolean;
    panSubmitted: boolean;
    deathCertificateSubmitted: boolean;
    policyNumber?: string;
    claimantName?: string;
    createdDate?: string;
    adminNote?: string;
    userId?: string;
  }) => Promise<void>;
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
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClaims(opts: { status?: string; userOnly?: boolean } = {}) {
    setLoading(true);
    try {
      const res = await api.fetchClaims(opts);
      setClaims(res as Claim[]);
    } catch (error) {
      console.error('Error fetching claims:', error);
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
    } catch (error) {
      console.error('Error creating claim:', error);
      throw error;
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
    } catch (error) {
      console.error('Error updating claim decision:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Fixed raiseClaim function - it should be separate from createClaim
  async function raiseClaim(claimData: {
    policyId: number;
    claimAmount: number;
    aadharSubmitted: boolean;
    panSubmitted: boolean;
    deathCertificateSubmitted: boolean;
    policyNumber?: string;
    claimantName?: string;
    createdDate?: string;
    adminNote?: string;
    userId?: string;
  }) {
    setLoading(true);
    try {
      // Find customer details from policyId
      const customer = customers.find(c => c.policyId === claimData.policyId);
      
      const payload = {
        ...claimData,
        policyNumber: claimData.policyNumber || customer?.policyNumber || 'UNKNOWN',
        claimantName: claimData.claimantName || customer?.holderName || 'Unknown',
        createdDate: claimData.createdDate || new Date().toISOString(),
        userId: claimData.userId || '1' // Default user ID
      };

      const created = await api.createClaim(payload);
      // Add optimistically to local list
      setClaims(prev => [created, ...prev]);
      
      // Refresh claims to get updated list
      await fetchClaims();
    } catch (error) {
      console.error('Error raising claim:', error);
      throw error;
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
    <ClaimsContext.Provider value={{ 
      customers, 
      claims, 
      loading, 
      fetchCustomers, 
      fetchClaims, 
      createClaim, 
      decisionOnClaim, 
      raiseClaim 
    }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export function useClaimsContext() {
  const ctx = useContext(ClaimsContext);
  if (!ctx) throw new Error('useClaimsContext must be used within ClaimsProvider');
  return ctx;
}