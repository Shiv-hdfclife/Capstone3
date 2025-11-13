//generic fetch/axios with token injection// src/services/api.ts
// Small API shell. Replace the placeholder URLs with real endpoints later.
// For now it returns dummy data to let the UI work without backend.

type Customer = any;
type Claim = any;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8082';

async function delay(ms = 400) {
  return new Promise(res => setTimeout(res, ms));
}

/// Dummy API service for testing

const dummyCustomers = [
  {
    policyId: 1,
    policyNumber: 'PN-000101',
    holderName: 'John Doe',
    coverageAmount: 500000,
    email: 'john@example.com',
    phone: '9991112223',
    active: true,
    createdDate: '2024-01-15',
    userId: '1'
  },
  {
    policyId: 2,
    policyNumber: 'PN-000102',
    holderName: 'Priya Singh',
    coverageAmount: 200000,
    email: 'priya@example.com',
    phone: '9993334445',
    active: true,
    createdDate: '2024-02-20',
    userId: '1'
  }
];

const dummyClaims = [
  {
    claimId: 1,
    policyNumber: 'PN-000101',
    claimantName: 'John Doe',
    claimAmount: 250000,
    status: 'Pending',
    aadharSubmitted: true,
    panSubmitted: true,
    deathCertificateSubmitted: false,
    createdDate: '2024-11-01',
    userId: '1'
  },
  {
    claimId: 2,
    policyNumber: 'PN-000102',
    claimantName: 'Priya Singh',
    claimAmount: 150000,
    status: 'Approved',
    aadharSubmitted: true,
    panSubmitted: true,
    deathCertificateSubmitted: true,
    createdDate: '2024-10-15',
    userId: '1'
  },
  {
    claimId: 3,
    policyNumber: 'PN-000103',
    claimantName: 'Rahul Kumar',
    claimAmount: 300000,
    status: 'Rejected',
    aadharSubmitted: false,
    panSubmitted: true,
    deathCertificateSubmitted: true,
    createdDate: '2024-10-20',
    adminNote: 'Missing Aadhar Card',
    userId: '2'
  }
];

const api = {
  async fetchCustomers() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...dummyCustomers];
  },

  async fetchClaims(opts: { status?: string; userOnly?: boolean } = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredClaims = [...dummyClaims];
    
    // Filter by status if provided
    if (opts.status && opts.status !== 'All') {
      filteredClaims = filteredClaims.filter(claim => claim.status === opts.status);
    }
    
    // Filter by user if userOnly is true
    if (opts.userOnly) {
      // For now, assume current user ID is '1'
      filteredClaims = filteredClaims.filter(claim => claim.userId === '1');
    }
    
    return filteredClaims;
  },

  async createClaim(payload: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newClaim = {
      claimId: Date.now(), // Simple ID generation
      policyNumber: payload.policyNumber || 'PN-NEW',
      claimantName: payload.claimantName || 'New Claimant',
      claimAmount: payload.claimAmount,
      status: 'Pending' as const,
      aadharSubmitted: payload.aadharSubmitted,
      panSubmitted: payload.panSubmitted,
      deathCertificateSubmitted: payload.deathCertificateSubmitted,
      createdDate: new Date().toISOString(),
      userId: '1'
    };
    
    // Add to dummy data
    dummyClaims.push(newClaim);
    
    return newClaim;
  },

  async decisionOnClaim(id: number, decision: { decision: string; note?: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const claimIndex = dummyClaims.findIndex(claim => claim.claimId === id);
    if (claimIndex !== -1) {
      dummyClaims[claimIndex] = {
        ...dummyClaims[claimIndex],
        status: decision.decision as 'Approved' | 'Rejected',
        adminNote: decision.note
      };
    }
    
    return dummyClaims[claimIndex];
  }
};

export default api;